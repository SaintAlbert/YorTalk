import {Component} from '@angular/core';
//import {App, NavController, NavParams} from '@ionic/angular';
import {SearchPeoplePage} from '../search-people/search-people';
import {MessagePage} from '../message/message';
import {DataProvider} from '../../services/data';
import {LoadingProvider} from '../../services/loading';
import { Nav } from '../../services/nav';

@Component({
  selector: 'page-new-message',
  templateUrl: 'new-message.html',
  styleUrls: ['new-message.scss']
})
export class NewMessagePage {
  private friends: any;
  private searchFriend: any;

  // NewMessagePage
  // This is the page where the user are asked to select a friend whom they want to start a conversation with.
  constructor(public navCtrl: Nav,  public dataProvider: DataProvider,
    public loadingProvider: LoadingProvider) { }

  ionViewDidLoad() {
    // Initialize
    this.searchFriend = '';
    this.loadingProvider.show();

    // Get user's friends.
    this.dataProvider.getCurrentUser().subscribe((account) => {
      if (account.friends) {
        for (var i = 0; i < account.friends.length; i++) {
          this.dataProvider.getUser(account.friends[i]).subscribe((friend) => {
            this.addOrUpdateFriend(friend);
          });
        }
      } else {
        this.friends = [];
      }
      this.loadingProvider.hide();
    });
  }

  // Back
  back() {
    this.navCtrl.pop("messages");
  }

  // Add or update friend for real-time sync.
  addOrUpdateFriend(friend) {
    if (!this.friends) {
      this.friends = [friend];
    } else {
      var index = -1;
      for (var i = 0; i < this.friends.length; i++) {
        if (this.friends[i].$key == friend.$key) {
          index = i;
        }
      }
      if (index > -1) {
        this.friends[index] = friend;
      } else {
        this.friends.push(friend);
      }
    }
  }

  // Search people.
  searchPeople() {
    //this.navCtrl.push(SearchPeoplePage);
    this.navCtrl.push('searchpeople');
  }

  // Open chat with this user.
  message(userId) {
    this.navCtrl.push('messages/message', { userId: userId });
  }
}
