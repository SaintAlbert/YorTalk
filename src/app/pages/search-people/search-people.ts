import {Component} from '@angular/core';
import {AlertController} from '@ionic/angular';
import {DataProvider} from '../../services/data';
import {LoadingProvider} from '../../services/loading';
import {AlertProvider} from '../../services/alert';
import {FirebaseProvider} from '../../services/firebase';


import { Nav } from '../../services/nav';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'page-search-people',
  templateUrl: 'search-people.html',
  styleUrls: ['search-people.scss']
})
export class SearchPeoplePage {
  private accounts: any=[];
  private alert: any;
  private account: any;
  private excludedIds: any = [];
  private requestsSent: any;
  private friendRequests: any;
  private searchUser: any;

  peopleItems = [];
  itemPeopleChunkData = [];
  defaultPeopleItems = [];
  page_number = 0;
  page_limit = 30;
  // SearchPeoplePage
  // This is the page where the user can search for other users and send a friend request.
  constructor(public navCtrl: Nav, public dataProvider: DataProvider, public loadingProvider: LoadingProvider,
    public alertCtrl: AlertController, public angularDb:AngularFireDatabase, public alertProvider: AlertProvider, public firebaseProvider: FirebaseProvider) { }

  ngOnInit () {
    // Initialize
    this.loadingProvider.show();
    this.searchUser = '';
    // Get all users.
    this.dataProvider.getUsers().subscribe((accounts) => {
      //this.loadingProvider.hide();
      //this.accounts = accounts;
      
      this.itemPeopleChunkData = this.dataProvider.paginate(accounts, this.page_limit)
     
      this.dataProvider.getCurrentUser().subscribe((account:any) => {
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
        this.dataProvider.getRequests(account.$key).subscribe((requests:any) => {
          this.requestsSent = requests.requestsSent;
          this.friendRequests = requests.friendRequests;
        });

        console.log(this.excludedIds)
        this.getPeople(false, "");
        this.peopleItems = accounts.filter((account) => this.excludedIds.indexOf(account.userId) == -1);
        //this.loadingProvider.hide()
      });
     
    });
  }

  getPeople(isFirstLoad, event) {
    console.log(this.page_number)
    for (let i = 0; i < this.itemPeopleChunkData.length; i++) {
      if (this.page_number == i) {
        //let items = this.itemPeopleData[this.page_number]
        let items = this.itemPeopleChunkData[this.page_number].filter((account) => this.excludedIds.indexOf(account.userId) == -1);
        items.forEach((v) => {
          this.accounts.push(v);
          })
        
        //console.log(this.accounts)
        this.defaultPeopleItems = this.accounts;
        this.page_number++;
        break;
      }
    }

    if (isFirstLoad)
      event.target.complete();
    else
      this.loadingProvider.hide()

   // this.page_number++;
  }

  doInfinite(event) {
    this.getPeople(true, event);
  }

  filterPeopleItems(searchText) {

    this.accounts= this.peopleItems.filter(it => {
        return it.name?.toLowerCase().includes(searchText.detail.value) ||
          it.username?.toLowerCase().includes(searchText.detail.value);
      });
    //console.log(searchText.detail.value,s)
  }

  showDefaultItems() {
    this.searchUser = '';
    this.accounts=this.defaultPeopleItems;
  }



  // Back
  back() {
    this.navCtrl.back();
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
