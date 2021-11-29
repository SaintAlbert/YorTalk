import { Injectable } from '@angular/core';
import { AlertProvider } from './alert';
import { AlertController, ModalController } from '@ionic/angular'
import { LoadingProvider } from './loading';
//import {Camera, CameraOptions} from '@ionic-native/camera';
import firebase from 'firebase/app';
import { AngularFireDatabase } from "angularfire2/database";
//import { AngularFireDatabase } from '@angular/fire/database';
import { CameraOptions, CameraResultType, CameraSource, Plugins } from '@capacitor/core';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DOC_ORIENTATION, NgxImageCompressService } from 'ngx-image-compress';
import { Nav } from './nav';
import { CameraModalPage } from '../components/camera-modal/camera-modal';

const { Camera } = Plugins

@Injectable({
  providedIn: 'root'
})
export class ImageProvider {
  // Image Provider
  // This is the provider class for most of the image processing including uploading images to Firebase.
  // Take note that the default function here uploads the file in .jpg. If you plan to use other encoding types, make sure to
  // set the encodingType before uploading the image on Firebase.
  // Example for .png:
  // data:image/jpeg;base64 -> data:image/png;base64
  // generateFilename to return .png
  private profilePhotoOptions: CameraOptions;
  private photoMessageOptions: CameraOptions;
  private groupPhotoOptions: CameraOptions;
  // All files to be uploaded on Firebase must have DATA_URL as the destination type.
  // This will return the imageURI which can then be processed and uploaded to Firebase.
  // For the list of cameraOptions, please refer to: https://github.com/apache/cordova-plugin-camera#module_camera.CameraOptions
  public alert: any;
  constructor(public angularDb: AngularFireDatabase,
    public alertProvider: AlertProvider,
    public loadingProvider: LoadingProvider,
    private storage: AngularFireStorage,
    private nav: Nav,
    //public camera: Camera,
    public alertCtrl: AlertController,
    private imageCompress: NgxImageCompressService,
    private modalCtrl: ModalController) {

    this.profilePhotoOptions = {
      quality: 100,
      width: 384,
      height: 384,
      //destinationType: this.camera.DestinationType.DATA_URL,
      resultType: CameraResultType.DataUrl,//CameraResultType.Base64,
      // encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
    };

    this.photoMessageOptions = {
      quality: 100,
      width: 384,
      height: 384,
      //destinationType: this.camera.DestinationType.DATA_URL,
      resultType: CameraResultType.Base64,
      //encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: false,
      allowEditing: true,
    };

    this.groupPhotoOptions = {
      quality: 100,
      width: 384,
      height: 384,
      //destinationType: this.camera.DestinationType.DATA_URL,
      resultType: CameraResultType.Base64,
      //encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
    };
  }

  // Function to convert dataURI to Blob needed by Firebase
  imgURItoBlob(dataURI) {

    ////return this.imageCompress.compressFile(dataURIImage, DOC_ORIENTATION.NotDefined, 100, 80).then(dataURI => {
    //  // if (dataURI) {
    //  console.warn('After Size in bytes was:', this.imageCompress.byteCount(dataURI));
    //  var binary = atob(dataURI.split(',')[1]);
    //  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    //  var array = [];
    //  for (var i = 0; i < binary.length; i++) {
    //    array.push(binary.charCodeAt(i));
    //  }
    //  return new Blob([new Uint8Array(array)], {
    //    type: mimeString
    //  });
    //  // }
    ////})

    var binary = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
      type: mimeString
    });
  }

  openModal(modalComponent: any, data: any) {
    return new Promise(async resolve => {
      var modal = await this.modalCtrl.create({
        component: modalComponent,
        cssClass: 'my-custom-class',
        componentProps: data
      });

      modal.onWillDismiss().then((date) => {
        //console.log(date.data)
        if (date.data)
          resolve(date.data)
        else
          resolve(null)
        //this.events.publish("onWillDismiss", date.data)
      })
      return await modal.present();
    })
  }

  // Generate a random filename of length for the image to be uploaded
  generateFilename() {
    var length = 8;
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text + ".jpg";
  }

  // Set ProfilePhoto given the user and the cameraSourceType.
  // This function processes the imageURI returned and uploads the file on Firebase,
  // Finally the user data on the database is updated.
  setProfilePhoto(user, sourceType) {
    //this.nav.openModal(CameraModalPage, null)

    this.profilePhotoOptions.source = sourceType;
    this.loadingProvider.show();
    // Get picture from camera or gallery.
    Camera.getPhoto(this.profilePhotoOptions).then(async (imageUrl) => {

      this.loadingProvider.hide();
      this.openModal(CameraModalPage, { image: imageUrl.dataUrl }).then((base64String) => {
        if (base64String) {
          // Process the returned imageURI.
          let imgBlob = this.imgURItoBlob(base64String);//this.imgURItoBlob("data:image/jpeg;base64," + base64String);
          let metadata = {
            'contentType': imgBlob.type
          };

          let fileUpload = this.initUploadObject()
          fileUpload.metadata = metadata;
          fileUpload.imgBlob = imgBlob;
          fileUpload.key = user.userId;
          fileUpload.fileName = this.generateFilename();
          //fileUpload.basePath = "/assets/images";
          fileUpload.baseSubPath = fileUpload.key + '/' + fileUpload.fileName;

          this.uploadFileToStorage(fileUpload, (fileU: FileUpload) => {
            this.deleteImageFile(user.img);
            let url = fileU.url;
            let profile = {
              displayName: user.name,
              photoURL: url
            };

            // Update Firebase User.
            firebase.auth().currentUser.updateProfile(profile)
              .then((success) => {
                // Update User Data on Database.
                this.angularDb.object('/accounts/' + user.userId).update({
                  img: url
                }).then((success) => {
                  this.loadingProvider.hide();
                  this.alertProvider.showProfileUpdatedMessage();
                }).catch((error) => {
                  console.log(error)
                  this.loadingProvider.hide();
                  this.alertProvider.showErrorMessage('profile/error-change-photo');
                });
              })
              .catch((error) => {
                console.log(error)
                this.loadingProvider.hide();
                this.alertProvider.showErrorMessage('profile/error-change-photo');
              });

          });
        }
      }).catch((error) => {
        console.log(error)
        this.loadingProvider.hide();
        this.alertProvider.showErrorMessage('profile/error-change-photo');
      });

    }).catch((error) => {
      this.loadingProvider.hide();
    });
  }

  // Upload and set the group object's image.
  setGroupPhoto(group, sourceType) {
    this.groupPhotoOptions.source = sourceType;
    this.loadingProvider.show();
    // Get picture from camera or gallery.
    //this.camera.getPicture(this.groupPhotoOptions).then((imageData) => {
    Camera.getPhoto(this.groupPhotoOptions).then(async (imageData) => {
      // Process the returned imageURI.
      let imgBlob = await this.imgURItoBlob("data:image/jpeg;base64," + imageData.base64String);
      let metadata = {
        'contentType': imgBlob.type
      };

      let fileUpload = this.initUploadObject()
      fileUpload.metadata = metadata;
      fileUpload.imgBlob = imgBlob;
      fileUpload.key = firebase.auth().currentUser.uid;
      fileUpload.fileName = this.generateFilename();
      //fileUpload.basePath = "/assets/images";
      fileUpload.baseSubPath = fileUpload.key + '/' + fileUpload.fileName;

      this.uploadFileToStorage(fileUpload, (fileU: FileUpload) => {
        this.deleteImageFile(group.img);
        // URL of the uploaded image!
        let url = fileU.url
        group.img = url;
        this.loadingProvider.hide();
      });


      //firebase.storage().ref().child('images/' + firebase.auth().currentUser.uid + '/' + this.generateFilename()).put(imgBlob, metadata).then((snapshot) => {
      //  this.deleteImageFile(group.img);
      //  // URL of the uploaded image!
      //  let url = snapshot.metadata.downloadURLs[0];
      //  group.img = url;
      //  this.loadingProvider.hide();
      //}).catch((error) => {
      //  this.loadingProvider.hide();
      //  this.alertProvider.showErrorMessage('image/error-image-upload');
      //});
    }).catch((error) => {
      this.alertProvider.showErrorMessage('image/error-image-upload');
      this.loadingProvider.hide();
    });
  }

  // Set group photo and return the group object as promise.
  setGroupPhotoPromise(group, sourceType): Promise<any> {
    return new Promise(resolve => {
      this.groupPhotoOptions.source = sourceType;
      this.loadingProvider.show();
      // Get picture from camera or gallery.
      //this.camera.getPicture(this.groupPhotoOptions).then((imageData) => {
      Camera.getPhoto(this.groupPhotoOptions).then(async (imageData) => {
        // Process the returned imageURI.
        let imgBlob = await this.imgURItoBlob("data:image/jpeg;base64," + imageData.base64String);
        let metadata = {
          'contentType': imgBlob.type
        };

        let fileUpload = this.initUploadObject()
        fileUpload.metadata = metadata;
        fileUpload.imgBlob = imgBlob;
        fileUpload.key = firebase.auth().currentUser.uid;
        fileUpload.fileName = this.generateFilename();
        //fileUpload.basePath = "/assets/images";
        fileUpload.baseSubPath = fileUpload.key + '/' + fileUpload.fileName;

        this.uploadFileToStorage(fileUpload, (fileU: FileUpload) => {
          this.deleteImageFile(group.img);
          // URL of the uploaded image!
          let url = fileU.url
          group.img = url;
          this.loadingProvider.hide();
          resolve(group);
        });

        //firebase.storage().ref().child('images/' + firebase.auth().currentUser.uid + '/' + this.generateFilename()).put(imgBlob, metadata).then((snapshot) => {
        //  this.deleteImageFile(group.img);
        //  // URL of the uploaded image!
        //  let url = snapshot.metadata.downloadURLs[0];
        //  group.img = url;
        //  this.loadingProvider.hide();
        //  resolve(group);
        //}).catch((error) => {
        //  this.loadingProvider.hide();
        //  this.alertProvider.showErrorMessage('image/error-image-upload');
        //});
      }).catch((error) => {
        this.loadingProvider.hide();
        this.alertProvider.showErrorMessage('image/error-image-upload');
      });
    });
  }

  //Delete the image given the url.
  deleteImageFile(path) {
    var fileName = path.substring(path.lastIndexOf('%2F') + 3, path.lastIndexOf('?'));
    firebase.storage().ref("/assets").child('images/' + firebase.auth().currentUser.uid + '/' + fileName).delete().then(() => { }).catch((error) => { });
  }

  //Delete the user.img given the user.
  deleteUserImageFile(user) {
    var fileName = user.img.substring(user.img.lastIndexOf('%2F') + 3, user.img.lastIndexOf('?'));
    firebase.storage().ref("/assets").child('images/' + user.userId + '/' + fileName).delete().then(() => { }).catch((error) => { });
  }

  // Delete group image file on group storage reference.
  deleteGroupImageFile(groupId, path) {
    var fileName = path.substring(path.lastIndexOf('%2F') + 3, path.lastIndexOf('?'));
    firebase.storage().ref("/assets").child('images/' + groupId + '/' + fileName).delete().then(() => { }).catch((error) => { });
  }

  // Upload photo message and return the url as promise.
  uploadPhotoMessage(conversationId, sourceType): Promise<any> {
    return new Promise(resolve => {
      this.photoMessageOptions.source = sourceType;
      this.loadingProvider.show();
      // Get picture from camera or gallery.
      //this.camera.getPicture(this.photoMessageOptions).then((imageData) => {
      Camera.getPhoto(this.photoMessageOptions).then(async (imageData) => {
        // Process the returned imageURI.
        let imgBlob = await this.imgURItoBlob("data:image/jpeg;base64," + imageData.base64String);
        let metadata = {
          'contentType': imgBlob.type
        };

        let fileUpload = this.initUploadObject()
        fileUpload.metadata = metadata;
        fileUpload.imgBlob = imgBlob;
        fileUpload.key = conversationId;
        fileUpload.fileName = this.generateFilename();
        //fileUpload.basePath = "/assets/images";
        fileUpload.baseSubPath = fileUpload.key + '/' + fileUpload.fileName;

        this.uploadFileToStorage(fileUpload, (fileU: FileUpload) => {
          // URL of the uploaded image!
          let url = fileU.url
          this.loadingProvider.hide();
          resolve(url);
        });


        // Generate filename and upload to Firebase Storage.
        //firebase.storage().ref().child('images/' + conversationId + '/' + this.generateFilename()).put(imgBlob, metadata).then((snapshot) => {
        //  // URL of the uploaded image!
        //  let url = snapshot.metadata.downloadURLs[0];
        //  this.loadingProvider.hide();
        //  resolve(url);
        //}).catch((error) => {
        //  this.loadingProvider.hide();
        //  this.alertProvider.showErrorMessage('image/error-image-upload');
        //});
      }).catch((error) => {
        this.loadingProvider.hide();
        this.alertProvider.showErrorMessage('image/error-image-upload');
      });
    });
  }

  // Upload group photo message and return a promise as url.
  uploadGroupPhotoMessage(groupId, sourceType): Promise<any> {
    return new Promise(resolve => {
      this.photoMessageOptions.source = sourceType;
      this.loadingProvider.show();
      // Get picture from camera or gallery.
      //this.camera.getPicture(this.photoMessageOptions).then((imageData) => {
      Camera.getPhoto(this.photoMessageOptions).then(async (imageData) => {
        // Process the returned imageURI.
        let imgBlob = await this.imgURItoBlob("data:image/jpeg;base64," + imageData.base64String);
        let metadata = {
          'contentType': imgBlob.type
        };

        let fileUpload = this.initUploadObject()
        fileUpload.metadata = metadata;
        fileUpload.imgBlob = imgBlob;
        fileUpload.key = groupId;
        fileUpload.fileName = this.generateFilename();
        //fileUpload.basePath = "/assets/images";
        fileUpload.baseSubPath = fileUpload.key + '/' + fileUpload.fileName;

        this.uploadFileToStorage(fileUpload, (fileU: FileUpload) => {
          // URL of the uploaded image!
          let url = fileU.url
          this.loadingProvider.hide();
          resolve(url);
        });

        // Generate filename and upload to Firebase Storage.
        //firebase.storage().ref().child('images/' + groupId + '/' + this.generateFilename()).put(imgBlob, metadata).then((snapshot) => {
        //  // URL of the uploaded image!
        //  let url = snapshot.metadata.downloadURLs[0];
        //  this.loadingProvider.hide();
        //  resolve(url);
        //}).catch((error) => {
        //  this.loadingProvider.hide();
        //  this.alertProvider.showErrorMessage('image/error-image-upload');
        //});
      }).catch((error) => {
        this.loadingProvider.hide();
        this.alertProvider.showErrorMessage('image/error-image-upload');
      });
    });
  }


  // ======== set post image ========
  setImage() {
    return new Promise(async (resolve, reject) => {
      this.alert = (await this.alertCtrl.create({
        header: 'Send Photo Message',
        message: 'Do you want to take a photo or choose from your photo gallery?',
        buttons: [
          {
            text: 'Cancel',
            handler: data => { }
          },
          {
            text: 'Choose from Gallery',
            handler: () => {
              this.photoMessageOptions.source = CameraSource.Photos//this.camera.PictureSourceType.PHOTOLIBRARY;
              //this.camera.getPicture(this.photoMessageOptions).then((imageData) => {
              Camera.getPhoto(this.photoMessageOptions).then((imageData) => {
                resolve("data:image/jpeg;base64," + imageData);
              });
            }
          },
          {
            text: 'Take Photo',
            handler: () => {
              this.photoMessageOptions.source = CameraSource.Camera//this.camera.PictureSourceType.CAMERA;
              //this.camera.getPicture(this.photoMessageOptions).then((imageData) => {
              Camera.getPhoto(this.photoMessageOptions).then((imageData) => {
                resolve("data:image/jpeg;base64," + imageData);
              });
            }
          }
        ]
      })).present();
    })
  }

  // ======= upload image in post folder ====
  uploadPostImage(url) {
    return new Promise(async (resolve, reject) => {
      let imgBlob = await this.imgURItoBlob(url);
      let metadata = {
        'contentType': imgBlob.type
      };

      let fileUpload = this.initUploadObject()
      fileUpload.metadata = metadata;
      fileUpload.imgBlob = imgBlob;
      fileUpload.key = "post";
      fileUpload.fileName = this.generateFilename();
      fileUpload.basePath = "/assets/images";
      fileUpload.baseSubPath = fileUpload.key + '/' + fileUpload.fileName;

      this.uploadFileToStorage(fileUpload, (fileU: FileUpload) => {
        // URL of the uploaded image!
        let url = fileU.url
        //this.loadingProvider.hide();
        resolve(url);
      });

      // Generate filename and upload to Firebase Storage.
      //firebase.storage().ref().child('images/post/' + this.generateFilename()).put(imgBlob, metadata).then((snapshot) => {
      //  // URL of the uploaded image!
      //  let url = snapshot.metadata.downloadURLs[0];
      //  resolve(url);
      //}).catch((error) => {
      //  this.alertProvider.showErrorMessage('image/error-image-upload');
      //  reject(error)
      //});
    }).catch((error) => {
      this.alertProvider.showErrorMessage('image/error-image-upload');
      //reject(error)
    });
  }


  uploadFileToStorage(fileUpload: FileUpload, callback): Observable<number> {
    let uploadTask: AngularFireUploadTask;
    const filePath = `${fileUpload.basePath}/${fileUpload.baseSubPath}`;
    const storageRef = this.storage.ref(filePath);
    if (fileUpload.metadata.contentType != "")
      uploadTask = this.storage.upload(filePath, fileUpload.imgBlob, fileUpload.metadata);
    else
      uploadTask = this.storage.upload(filePath, fileUpload.imgBlob);

    uploadTask

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          fileUpload.url = downloadURL;
          callback(fileUpload);
        });
      })
    ).subscribe();

    return uploadTask.percentageChanges();
  }

  initUploadObject(): FileUpload {
    return new FileUpload()
  }


}





export class FileUpload {
  key: string;
  fileName: string;
  url: string;
  imgBlob: Blob;
  metadata = {
    'contentType': ""
  };
  basePath: string = "/assets/images";
  baseSubPath: string;


  constructor() {
  }

}
