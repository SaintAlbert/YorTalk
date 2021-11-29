import { Component } from '@angular/core';
//import {AngularFireDatabase} from 'angularfire2/database';
import { LoadingProvider } from '../../services/loading';
import { DataProvider } from '../../services/data';
//import firebase from 'firebase/app';
import { Nav } from '../../services/nav';
import { AngularFireDatabase } from 'angularfire2/database';


@Component({
  selector: 'page-live-room',
  templateUrl: 'live-room.html',
  styleUrls: ['live-room.scss']
})
export class LiveRoomPage {
  source: string='';
  format: string = '';
  output: string = '';



  roomConversations: any = [];
  searchFriend: any;
  //currentUser;
  // MessagesPage
  // This is the page where the user can see their current conversations with their friends.
  // The user can also start a new conversation.
  constructor(public navCtrl: Nav, public angularDb: AngularFireDatabase, public loadingProvider: LoadingProvider, public dataProvider: DataProvider) { }

  ngOnInit() {
    // Create userData on the database if it doesn't exist yet.
    //ffmpeg({ source }).format(format)..save(output);
  }


  // New conversation.
  newPotRoom() {
    //this.app.getRootNav().push(NewMessagePage);
    this.navCtrl.push('newpotlive')
  }

  // Open chat with friend.
  room(userId) {
    this.navCtrl.push('message', { userId: userId })
    //this.app.getRootNav().push(MessagePage, { userId: userId });
  }

  // Return class based if conversation has unreadMessages or not.
  hasUnreadMessages(conversation) {
    if (conversation.unreadMessagesCount > 0) {
      return 'bold';
    } else
      return '';
  }
}
