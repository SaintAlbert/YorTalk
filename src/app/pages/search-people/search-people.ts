import {Component} from '@angular/core';
import {AlertController} from '@ionic/angular';
import {DataProvider} from '../../services/data';
import {LoadingProvider} from '../../services/loading';
import {AlertProvider} from '../../services/alert';
import {FirebaseProvider} from '../../services/firebase';
import {AngularFireDatabase} from 'angularfire2/database';

import { Nav } from '../../services/nav';

@Component({
  selector: 'page-search-people',
  templateUrl: 'search-people.html',
  styleUrls: ['search-people.scss']
})
export class SearchPeoplePage {
  private accounts: any;
  private alert: any;
  private account: any;
  private excludedIds: any;
  private requestsSent: any;
  private friendRequests: any;
  private searchUser: any;
  // SearchPeoplePage
  // This is the page where the user can search for other users and send a friend request.
  constructor(public navCtrl: Nav, public dataProvider: DataProvider, public loadingProvider: LoadingProvider,
    public alertCtrl: AlertController, public angularDb:AngularFireDatabase, public alertProvider: AlertProvider, public firebaseProvider: FirebaseProvider) { }

  ionViewDidLoad() {
    // Initialize
    this.loadingProvider.show();
    this.searchUser = '';
    // Get all users.
    this.dataProvider.getUsers().subscribe((accounts) => {
      this.loadingProvider.hide();
      this.accounts = accounts;
      this.dataProvider.getCurrentUser().subscribe((account) => {
        // Add own userId as exludedIds.
        this.excludedIds = [];
        this.account = account;
        if (this.excludedIds.indexOf(account.$key) == -1) {
          this.excludedIds.push(account.$key);
        }
        // Get friends which will be filtered out from the list using searchFilter pipe pipes/search.ts.
        if (account.friends) {
          account.friends.forEach(friend => {
            if (this.excludedIds.indexOf(friend) == -1) {
              this.excludedIds.push(friend);
            }
          });
        }
        // Get requests of the currentUser.
        this.dataProvider.getRequests(account.$key).subscribe((requests) => {
          this.requestsSent = requests.requestsSent;
          this.friendRequests = requests.friendRequests;
        });
      });
    });
  }

  // Back
  back() {
    this.navCtrl.popToRoot();
  }

  // Get the status of the user in relation to the logged in user.
  getStatus(user) {
    // Returns:
    // 0 when user can be requested as friend.
    // 1 when a friend request was already sent to this user.
    // 2 when this user has a pending friend request.
    if (this.requestsSent) {
      for (var i = 0; i < this.requestsSent.length; i++) {
        if (this.requestsSent[i] == user.$key) {
          return 1;
        }
      }
    }
    if (this.friendRequests) {
      for (var i = 0; i < this.friendRequests.length; i++) {
        if (this.friendRequests[i] == user.$key) {
          return 2;
        }
      }
    }
    return 0;
  }

  // Send friend request.
  async sendFriendRequest(user) {
    this.alert = (await this.alertCtrl.create({
        header: 'Send Friend Request',
        message: 'Do you want to send friend request to <b>' + user.name + '</b>?',
        buttons: [
            {
                text: 'Cancel',
                handler: data => { }
            },
            {
                text: 'Send',
                handler: () => {
                    this.firebaseProvider.sendFriendRequest(user.$key);
                }
            }
        ]
    })).present();
  }

  // Cancel friend request sent.
  async cancelFriendRequest(user) {
    this.alert = (await this.alertCtrl.create({
        header: 'Friend Request Pending',
        message: 'Do you want to delete your friend request to <b>' + user.name + '</b>?',
        buttons: [
            {
                text: 'Cancel',
                handler: data => { }
            },
            {
                text: 'Delete',
                handler: () => {
                    this.firebaseProvider.cancelFriendRequest(user.$key);
                }
            }
        ]
    })).present();
  }

  // Accept friend request.
  async acceptFriendRequest(user) {
    this.alert = (await this.alertCtrl.create({
        header: 'Confirm Friend Request',
        message: 'Do you want to accept <b>' + user.name + '</b> as your friend?',
        buttons: [
            {
                text: 'Cancel',
                handler: data => { }
            },
            {
                text: 'Reject Request',
                handler: () => {
                    this.firebaseProvider.deleteFriendRequest(user.$key);
                }
            },
            {
                text: 'Accept Request',
                handler: () => {
                    this.firebaseProvider.acceptFriendRequest(user.$key);
                }
            }
        ]
    })).present();
  }

  // View user.
viewUser(userId) {
  this.navCtrl.push('userinfo', {userId: userId});
  }

}
