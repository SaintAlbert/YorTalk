import { Component, Input } from '@angular/core';
import { FirebaseProvider } from '../../services/firebase';
import { DataProvider } from '../../services/data';
import { Nav } from '../../services/nav';
import  firebase from 'firebase/app';


/**
 * Generated class for the CommentsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
//@IonicPage()
@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
  styleUrls: ['comments.scss']
})
export class CommentsPage {
  @Input() postKey: any
  //postKey;
  commentText;
  comments: any;
  constructor(public navCtrl: Nav,
    //public viewCtrl: ModalController,
    public firebaseProvider: FirebaseProvider,

    public dataProvider: DataProvider) {
    //this.postKey = this.navCtrl.get('postKey')
  }

  ngOnInit () {


    this.dataProvider.getComments(this.postKey).subscribe((comments) => {
      if (this.comments) {
        let tempComments = comments[comments.length - 1];
        let tempData = <any>{};
        tempData = tempComments;
        this.dataProvider.getUser(tempComments.commentBy).valueChanges().subscribe((user:any) => {
          tempData.avatar = user.img;
          tempData.name = user.name
        });
        // this.addOrUpdateTimeline(tempData)
        this.comments.push(tempData);
      } else {
        this.comments = []
        comments.forEach((comment) => {
          if (comment.$exists()) {
            let tempComment = comment;
            let tempData = <any>{};
            tempData = tempComment;
            this.dataProvider.getUser(tempComment.commentBy).valueChanges().subscribe((user: any) => {
              tempData.avatar = user.img;
              tempData.name = user.name
            });
            // this.addOrUpdateTimeline(tempData)
            this.comments.push(tempData);
          }
        })
      }
    })
  }
  dismiss() {
    this.navCtrl.closeModal();
  }


  postComment() {
    let comment = {
      dateCreated: new Date().toString(),
      commentBy: firebase.auth().currentUser.uid,
      commentText: this.commentText,
    }
    this.firebaseProvider.commentPost(this.postKey, comment).then((res) => {
      this.commentText = ''
    })
  }
}
