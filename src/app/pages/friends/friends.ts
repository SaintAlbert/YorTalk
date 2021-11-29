import {Component} from "@angular/core";
;
import {DataProvider} from "../../services/data";
import {LoadingProvider} from "../../services/loading";
import firebase from "firebase/app";
import _ from "lodash";
import {SocialSharing} from "@ionic-native/social-sharing";
import {UpdateContactPage} from "../../components/update-contact/update-contact";

import {Contacts} from "@ionic-native/contacts";
import { Nav } from "../../services/nav";
//import { map } from "rxjs/operators";

@Component({
  selector: "page-friends",
  templateUrl: "friends.html",
  styleUrls: ['friends.scss']
})
export class FriendsPage {
   friends: any;
   friendRequests: any;
   searchFriend: any;
  mode = "Friends";
  contactFriends: any;
  isLoadding = true;
  account: any;
  isContentNumber = false;
  // FriendsPage
  // This is the page where the user can search, view, and initiate a chat with their friends.
  constructor(
    public dataProvider: DataProvider,
    public loadingProvider: LoadingProvider,
    private contacts: Contacts,
    public socialsharing: SocialSharing,
    private nav:Nav
  ) {}

  ngOnInit() {

    // Initialize
    this.searchFriend = "";
    this.loadingProvider.show();

    // Get friendRequests to show friendRequests count.
    this.dataProvider
      .getRequests(firebase.auth().currentUser.uid)
      .subscribe(requests => {
        this.friendRequests = requests.friendRequests;
      });

    // Get user data on database and get list of friends.
    let userData = this.dataProvider.getCurrentUser().subscribe(account => {
      this.account = account;
      if (this.account.phoneNumber != "") {
        this.isContentNumber = true;
      }
      if (account.friends) {
        for (var i = 0; i < account.friends.length; i++) {
          this.dataProvider.getUser(account.friends[i]).valueChanges().subscribe(friend => {
            this.addOrUpdateFriend(friend);
          });
        }
      } else {
        this.friends = [];
      }

      // this.getContact()
      // ==== GET CONTACT ===
      this.dataProvider.getContact().then(data => {
        if (data && this.account != "") {
          this.dataProvider
            .setContactWithCountryCode(this.account.countryCode)
            .then((friend:[]) => {
         
              
              if (friend.length>0) {
                this.contactFriends = friend;
                this.contactFriends = _.sortBy(this.contactFriends, ["name"]);
              }
              this.isLoadding = false;
            });
        }
      });
      this.loadingProvider.hide();
      userData.unsubscribe();
    });


  }

  // Add or update friend data for real-time sync.
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

  // update contact number
  updateContact() {
    this.nav.openModal(UpdateContactPage, {
      userData: this.account
    });

  }

  //// Proceed to searchPeople page.
  searchPeople() {
    this.nav.push('searchpeople');
   // this.app.getRootNav().push(SearchPeoplePage);
  }

  // Proceed to requests page.
  manageRequests() {
    this.nav.push('frendrequests');
    //this.app.getRootNav().push(RequestsPage);
  }

  // Proceed to userInfo page.
  viewUser(userId) {
    this.nav.push('userinfo', { userId: userId });
    //this.app.getRootNav().push(UserInfoPage, { userId: userId });
  }

  // Proceed to chat page.
  message(userId) {
    this.nav.push('message', { userId: userId });
    //this.app.getRootNav().push(MessagePage, { userId: userId });
  }


  // get Contact number
  // getContact(){
  //   this.contacts.find(["*"],{}).then((data)=>{

  //     // this.contactlist = data
  //     for (let i=0; i<data.length; i++) {
  //         setTimeout( ()=>{
  //               let _phoneNumber ;
  //               if(data[i].phoneNumbers[0].value.toString().charAt(0) == '*' ||
  //                    data[i].phoneNumbers[0].value.toString().charAt(0) == '#') {
  //               }else{
  //                 let temp = data[i].phoneNumbers[0].value.toString().split('(').join('');
  //                 temp = temp.split(')').join("");
  //                 temp = temp.split('(').join("");
  //                 temp = temp.split(' ').join("");
  //                 temp = temp.replace(/\s/g,"");
  //                 temp = temp.split('-').join("");

  //                 if(temp.charAt(0) == '+') {
  //                     let _phoneNumber = temp.toString();
  //                     this.contactNumber(_phoneNumber,data[i])
  //                 }else if (temp.charAt(0) == '0' && temp.charAt(1) == '0'){
  //                   let _phoneNumber = '+1' + temp.substr(2).toString();
  //                   this.contactNumber(_phoneNumber,data[i])
  //                 }else if(temp.charAt(0) == '0') {
  //                   let _phoneNumber = '+1' + temp.substr(1).toString();
  //                   this.contactNumber(_phoneNumber,data[i])
  //                 }else {
  //                   let _phoneNumber = '+1' + temp.toString();
  //                   this.contactNumber(_phoneNumber,data[i])
  //                 }
  //               }

  //         }, i*1000 );
  //     }

  //     setTimeout(()=>{
  //        this.contactFriends = _.sortBy(this.contactFriends, ['isUser', 'name']);
  //        this.isLoadding = false;
  //     },1000*data.length)
  //   })
  // }

  // contactNumber(_phoneNumber,data){
  //   this.dataProvider.getUserWithPhonenumber(_phoneNumber).take(1).subscribe((userList) => {
  //       if(userList.length>0){
  //         let _tempData = userList[0]
  //         _tempData.isUser ='0'; // is user
  //         if (this.account.friends) {
  //            let index =  this.account.friends.indexOf(_tempData.userId)
  //            if(index>=0){
  //                _tempData.isFriend = '0' // is alerday friend
  //                this.contactFriends.push(_tempData)
  //            }else{
  //              this.contactFriends.push(_tempData)
  //            }
  //         }
  //       }else{
  //         let _tempData = {
  //           phoneNumber:_phoneNumber,
  //           isUser:'1', // is not user
  //           img:"assets/images/profile.png",
  //           name: this.getNameFromContact(data,_phoneNumber),
  //         }
  //        this.contactFriends.push(_tempData)
  //       }

  //   })
  // }

  // getNameFromContact(contact,number) {
  //   // if(JSON.stringify(contact.name) == '{}') {
  //   //   return 'Unknown';
  //   // } else {
  //   //   return contact.name.formatted;
  //   // }
  //   if(contact.name){
  //     if(contact.name.formatted){
  //       return contact.name.formatted;
  //     }else{
  //     return number
  //     }
  //   }else{
  //     return number
  //   }
  // }
  inivite(data) {
    let msg =
      "Hey, I am using ionSocial. It's Awsome app please download it. http://mayoraservices.com";
    this.socialsharing.shareViaSMS(msg, data.phoneNumber);
  }
}
