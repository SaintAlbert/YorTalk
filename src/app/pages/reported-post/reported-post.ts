import {Component} from '@angular/core';
import {ActionSheetController} from '@ionic/angular';
import {DataProvider} from '../../services/data';
import {LoadingProvider} from '../../services/loading';
import { Nav } from '../../services/nav';

/**
 * Generated class for the ReportedPostPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
//@IonicPage()
@Component({
  selector: 'page-reported-post',
  templateUrl: 'reported-post.html',
  styleUrls: ['reported-post.scss']
})
export class ReportedPostPage {
  reportedPost = []
  constructor(public navCtrl: Nav, 
    public dataProvider: DataProvider, 
    public loadingProvider: LoadingProvider,  

    public actionSheetCtrl: ActionSheetController,
  ) {
  }

  ngOnInit () {
    console.log('ionViewDidLoad ReportedPostPage');
    this.loadingProvider.show();    
    this.getReportedPost()
  }

  async reportPost(item) {
    let actionSheet = this.actionSheetCtrl.create({
      header: "Reported Post",
      buttons: [
        {
          text: 'Delete post',
          role: 'destructive',
          handler: () => {
            console.log(" report Post ", item);
            this.dataProvider.removePost(item)
          }
        },
        {
          text: 'Ignore Post',
          role: 'destructive',
          handler: () => {
            console.log('Cancel clicked', item);
          
            this.dataProvider.ignorePost(item)
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    (await actionSheet).present();
  }


  getReportedPost() {
    this.dataProvider.getAllReportedPost().subscribe((post) => {
      this.loadingProvider.hide();
      this.reportedPost = post;
    })
  }

}
