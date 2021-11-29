import {Component} from '@angular/core';
import {AlertController} from '@ionic/angular';
import {DataProvider} from '../../services/data';
import {LoadingProvider} from '../../services/loading';
import {FirebaseProvider} from '../../services/firebase';
//import {MessagePage} from '../message/message';
import { ImageModalPage } from '../../components/image-modal/image-modal';
import firebase  from 'firebase/app';
import { Nav } from '../../services/nav';
import { map } from 'rxjs/operators';

@Component({
  selector: 'page-user-info',
  templateUrl: 'user-info.html',
  styleUrls: ['user-info.scss']
})
export class UserInfoPage {
  private user: any;
  private userId: any;
  private friendRequests: any;
  private requestsSent: any;
  private friends: any;
  private alert: any;
  // UserInfoPage
  // This is the page where the user can view user information, and do appropriate actions based on their relation to the current logged in user.
  constructor(public navCtrl: Nav,  public dataProvider: DataProvider,
    public loadingProvider: LoadingProvider, public alertCtrl: AlertController, public firebaseProvider: FirebaseProvider) { }

  ngOnInit () {
    this.userId = this.navCtrl.get('userId');
    this.loadingProvider.show();
    // Get user info.
    this.dataProvider.getUser(this.userId)
      //.valueChanges()
      .snapshotChanges()
      .pipe(map(p => { return this.dataProvider.extractFBData(p) }))
      .subscribe((user) => {
      this.user = user;
      this.loadingProvider.hide();
    });
    // Get friends of current logged in user.
    this.dataProvider.getUser(firebase.auth().currentUser.uid)
      //.valueChanges()
      .snapshotChanges()
      .pipe(map(p => { return this.dataProvider.extractFBData(p) }))
      .subscribe((user: any) => {
      this.friends = user.friends;
    });
    // Get requests of current logged in user.
    this.dataProvider.getRequests(firebase.auth().currentUser.uid).subscribe((requests:any) => {
      this.friendRequests = requests.friendRequests;
      this.requestsSent = requests.requestsSent;
    });
  }

  // Back
  back() {
    //this.navCtrl.popToRoot();
    this.navCtrl.back();
  }

  // Enlarge user's profile image.
  enlargeImage(img) {
    this.navCtrl.openModal(ImageModalPage, { img: img });
   
  }

  // Accept friend request.
  async acceptFriendRequest() {
    this.alert = (await this.alertCtrl.create({
        header: 'Confirm Friend Request',
        message: 'Do you want to accept <b>' + this.user.name + '</b> as your friend?',
        buttons: [
            {
                text: 'Cancel',
                handler: data => { }
            },
            {
                text: 'Accept',
                handler: () => {
                    this.firebaseProvider.acceptFriendRequest(this.userId);
                }
            }
        ]
    })).present();
  }

  // Deny friend request.
  async rejectFriendRequest() {
    this.alert = (await this.alertCtrl.create({
        header: 'Reject Friend Request',
        message: 'Do you want to reject <b>' + this.user.name + '</b> as your friend?',
        buttons: [
            {
                text: 'Cancel',
                handler: data => { }
            },
            {
                text: 'Reject',
                handler: () => {
                    this.firebaseProvider.deleteFriendRequest(this.userId);
                }
            }
        ]
    })).present();
  }

  // Cancel friend request sent.
  async cancelFriendRequest() {
    this.alert = (await this.alertCtrl.create({
        header: 'Friend Request Pending',
        message: 'Do you want to delete your friend request to <b>' + this.user.name + '</b>?',
        buttons: [
            {
                text: 'Cancel',
                handler: data => { }
            },
            {
                text: 'Delete',
                handler: () => {
                    this.firebaseProvider.cancelFriendRequest(this.userId);
                }
            }
        ]
    })).present();
  }

  // Send friend request.
  async sendFriendRequest() {
    this.alert = (await this.alertCtrl.create({
        header: 'Send Friend Request',
        message: 'Do you want to send friend request to <b>' + this.user.name + '</b>?',
        buttons: [
            {
                text: 'Cancel',
                handler: data => { }
            },
            {
                text: 'Send',
                handler: () => {
                    this.firebaseProvider.sendFriendRequest(this.userId);
                }
            }
        ]
    })).present();
  }

  // Open chat with this user.
  sendMessage() {
    this.navCtrl.push('messages/message', { userId: this.userId });
  }

  // Check if user can be added, meaning user is not yet friends nor has sent/received any friend requests.
  canAdd() {
    if (this.friendRequests) {
      if (this.friendRequests.indexOf(this.userId) > -1) {
        return false;
      }
    }
    if (this.requestsSent) {
      if (this.requestsSent.indexOf(this.userId) > -1) {
        return false;
      }
    }
    if (this.friends) {
      if (this.friends.indexOf(this.userId) > -1) {
        return false;
      }
    }
    return true;
  }

  // Un friend 
  unFriend(userId){
    this.dataProvider.unFriend(userId)
  }
}
