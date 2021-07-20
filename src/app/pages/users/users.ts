import {Component} from '@angular/core';
import {AlertController} from '@ionic/angular';
import {DataProvider} from '../../services/data';
import {LoadingProvider} from '../../services/loading';
import {AngularFireDatabase} from 'angularfire2/database';
import {AlertProvider} from '../../services/alert';
import { Nav } from '../../services/nav';

/**
 * Generated class for the UsersPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
//@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
  styleUrls: ['users.scss']
})
export class UsersPage {
  private users: any;
  private alert;

  constructor(public navCtrl: Nav,
   // public navParams: NavParams,
    public loadingProvider: LoadingProvider,
    public alertCtrl: AlertController, 
    public angularDb:AngularFireDatabase, 
    public alertProvider: AlertProvider,
    public dataProvider: DataProvider,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UsersPage');
    this.loadingProvider.show();
    this.dataProvider.getUsers().subscribe((user) => {
      this.loadingProvider.hide();
      this.users = <any>user;
    });
  }

  async blockUser(user){
    this.alert = (await this.alertCtrl.create({
        header: 'Confirm to Block this user',
        message: 'Are you sure you want to block user?',
        buttons: [
            {
                text: 'No'
            },
            {
                text: 'Yes',
                handler: data => {
                    this.angularDb.object('/accounts/' + user.userId).update({
                        isBlock: true
                    }).then((success) => {
                    });
                }
            }
        ]
    })).present();
  }
  async unblockUser(user){
    this.alert = (await this.alertCtrl.create({
        header: 'Confirm to unBlock this user',
        message: 'Are you sure you want to unblock user?',
        buttons: [
            {
                text: 'No'
            },
            {
                text: 'Yes',
                handler: data => {
                    this.angularDb.object('/accounts/' + user.userId).update({
                        isBlock: false
                    }).then((success) => {
                    });

                }
            }
        ]
    })).present();
  }

 
}
