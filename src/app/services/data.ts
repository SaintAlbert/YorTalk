import { Injectable, OnInit } from "@angular/core";
import { AngularFireDatabase } from "angularfire2/database";
import firebase from "firebase/app";
import { Contacts } from "@ionic-native/contacts";

//import { Storage } from "@ionic/storage";
import { Plugins } from '@capacitor/core';
const { Storage
  //, Contacts
} = Plugins
//import { Contact } from '@capacitor-community/contacts';
import async from "async";
import _ from 'lodash';
import { map } from 'rxjs/operators';
import { Platform } from "@ionic/angular";
import { Constants, ApiHttpService } from "./ApiHttpService";


@Injectable()
export class DataProvider {
  // Data Provider
  // This is the provider class for most of the Firebase observables in the app.
  webRTCClient;
  incomingCallId;
  userContactsList = [];
  userOnlyContacts = [];
  exitsUserList = [];
  inviteUserList = [];
  userContactsListWithCountryCode = [];
  isContactGet = false;
  countryCode = "+1";
  curentUser;

  constructor(
    private platform: Platform,
    public angularDb: AngularFireDatabase,
    private contacts: Contacts,
    private api: ApiHttpService,
    
    //private storage: Storage,
  ) {
    firebase.auth().onAuthStateChanged((user) => {
      this.curentUser = user; //console.log(this.curentUser);
      //this.createLiveStream(true, ["yhhoJGjAZTzKbBHG342Ta01ryAdvn2", "boJGjAZTzKbBHG342Ta01ryAdui6","boJGjAZTzKbBHG342Ta01ryAdvnii"]);
      // this.getAllLiveStream()
      //this.angularDb.object("/live/_z22i3Xsq" ).valueChanges()
      //  .subscribe((data) => {
      //  console.log(data)
      //})
      //this.getLiveStream("hANBguOe4").valueChanges().subscribe((data) => {
      //      console.log(data)
      //    })

      this.getRoomStream().subscribe((resData) => {
        console.log(resData)
        resData.forEach((val) => {
          this.getLiveStream(val.$key).valueChanges().subscribe((data) => {
            console.log(data)
          })
        })
      })

      //this.getLiveroomsStream("").valueChanges().subscribe((data) => {
      //      console.log(data)
      //    })

    })

  }


  // set webRTCClient
  setWebRTCClient(val) {
    this.webRTCClient = val;
  }

  // get webRTCClient
  getwebRTCClient() {
    return this.webRTCClient;
  }

  // set Incoming Call id
  setIncomingCallId(id) {
    this.incomingCallId = id;
  }

  // get incoming call id
  getIncomingCallid() {
    return this.incomingCallId;
  }

  extractFBData(payloadData) {
    //if (payloadData.key != null)
    //return { $key: payloadData.key, $val: payloadData.payload.val() ? payloadData.payload.val():null, $exists: function () { return payloadData.payload.exists() } }

    //if (payloadData.key != null) {
    //console.log({ key: payloadData.key, ...payloadData.payload.val(), $exists: payloadData.payload.exists() })
    return { $key: payloadData.key, ...payloadData.payload.val(), $exists: payloadData.payload.exists() };
    //}
    //  else
    //    return { key: payloadData.key,...[], $exists: function () { return payloadData.payload.exists() } };
  }

  // Get all users
  getUsers() {
    return this.angularDb.list('/accounts', ref => ref.orderByChild('name')).snapshotChanges().take(1)
      .pipe(map(pages => { return pages.map(p => (this.extractFBData(p))); }));
  }

  // Get user with username
  getUserWithUsername(username) {
    return this.angularDb.list('/accounts', ref => ref.orderByChild('username').equalTo(username)).snapshotChanges().take(1)
      .pipe(map(pages => { return pages.map(p => (this.extractFBData(p))); }));
  }

  // Get user with phonenumber
  getUserWithPhonenumber(phoneNumber) {
    return this.angularDb.list('/accounts', ref => ref.orderByChild('phoneNumber').equalTo(phoneNumber)).snapshotChanges().take(1)
      .pipe(map(pages => { return pages.map(p => (this.extractFBData(p))); }));
  }

  // Get logged in user data
  getCurrentUser() {
    // console.log("UserID ", firebase.auth().currentUser.uid)
    return this.angularDb.object("/accounts/" + firebase.auth().currentUser.uid).snapshotChanges()
      .pipe(map(p => { return this.extractFBData(p) }))
  }

  // Get user by their userId
  getUser(userId) {
    return this.angularDb.object("/accounts/" + userId)
    //.valueChanges();
  }


  // Get requests given the userId.
  getRequests(userId) {
    return this.angularDb.object("/requests/" + userId).snapshotChanges()
      .pipe(map(p => { return this.extractFBData(p) }))
  }

  // Get friend requests given the userId.
  getFriendRequests(userId) {
    return this.angularDb.list('/requests', ref => ref.orderByChild('receiver').equalTo(userId)).snapshotChanges().take(1)
      .pipe(map(pages => { return pages.map(p => (this.extractFBData(p))); }));
  }

  // Get conversation given the conversationId.
  getConversation(conversationId) {
    return this.angularDb.object("/conversations/" + conversationId);
  }

  // Get conversations of the current logged in user.
  getConversations() {
    return this.angularDb.list(
      "/accounts/" + firebase.auth().currentUser.uid + "/conversations"
    ).snapshotChanges().take(1)
      .pipe(map(pages => { return pages.map(p => (this.extractFBData(p))); }));
  }

  // Get messages of the conversation given the Id.
  getConversationMessages(conversationId) {
    return this.angularDb.object(
      "/conversations/" + conversationId + "/messages"
    ).snapshotChanges().pipe(map(p => { return this.extractFBData(p) }))
  }

  // Get messages of the group given the Id.
  getGroupMessages(groupId) {
    return this.angularDb.object("/groups/" + groupId + "/messages").snapshotChanges()
      .pipe(map(p => { return this.extractFBData(p) }))
  }

  // Get groups of the logged in user.
  getGroups() {
    return this.angularDb.list(
      "/accounts/" + firebase.auth().currentUser.uid + "/groups"
    ).snapshotChanges().take(1)
      .pipe(map(pages => { return pages.map(p => (this.extractFBData(p))); }));
  }

  // Get group info given the groupId.
  getGroup(groupId) {
    return this.angularDb.object("/groups/" + groupId);
  }


  generateStreamKey() {

    return this.api.get(Constants.API_ENDPOINT + '/genkey').take(1).subscribe((data) => {
      return { ...data }
    })
  }

  //Creating rooms for user
  //db.collection('rooms')
  createLiveStream(allowpaymentTo = false, userIds = [], description = '', facebookkey = '', youtubekey = '', switchkey = '', viewer = 0, isPotAllow = false) {
    return new Promise((resolve, rejects) => {
      //this.ffmpg.pushLiveVideo(stream, key, {}, switchkey, youtubekey, facebookkey)
      //let streamkey;
      ////let opt = { auth: { user: 'admin', password: 'admin' } };
      //this.api.get(Constants.API_ENDPOINT + '/genkey')
      //  .subscribe((data: any) => {})


      //    //var ref = firebase.database().ref("/accounts/" + firebase.auth().currentUser.uid);
      //    //ref.child("/live").child(streamkey).set(streamData)
      //    //  .then(() => {
      //    //    //Start live streaming
      //    //    console.log("streamkey: ", streamkey)
      //    //  });

      //    //var ref = firebase.database().ref("/live");
      //    //ref.child(streamkey).set(streamData)
      //    //  .then(() => {
      //    //    //Start live streaming
      //    //    console.log("streamkey: ", streamkey)
      //    //  });
      //  });


      let streamData = {
        description: description,
        thumpnail: '',
        //youtubekey: youtubekey,
        //facebookkey: facebookkey,
        //switchkey: switchkey,
        metrics: {
          views: 0,
          likes: 0,
          loves: 0,
          shares: 0,
        },
        comments: [],
        isPotAllow: isPotAllow,
        allowpaymentTo: allowpaymentTo,
        ownerPot: [{
          //currency: '',
          //amount: 0,
          //user: ''
        }],
        isLive:true

      };

      //Allow to set paymentTo other user;
      if (allowpaymentTo) {
        //streamData[userId]
        let users = [];

        userIds.map((userId) => {
          let user = {
            [userId]: {
              currency: '',
              amount: 0,
            }
          };
          users.push(user);
        })
        streamData["paymentTo"] = users;
      }

      //this.angularDb.list("liverooms").remove()
      //this.angularDb.list("roomsdetail").remove()

      this.angularDb.list("liverooms").push({
        user: firebase.auth().currentUser.uid,
        live: true,
        subscribers: [{}],
        dateCreated: new Date().toString(),
        dateUpdatedted: new Date().toString(),
      }).then((item) => {
        let streamkey = item.key;
        this.angularDb.list("roomsdetail/" + streamkey).push(streamData).then((item) => {
          //console.log("item", item)
          resolve({ streamkey: streamkey, switchkey: switchkey, youtubekey: youtubekey, facebookkey: facebookkey });
        })
      })

    })
  }

  getRoomStream() {
    return this.angularDb.list("liverooms")
      .snapshotChanges()
      .pipe(map(pages => { return pages.map(p => (this.extractFBData(p))); }));

  }

  // Get All LiveStream 
  getLiveStream(streamkey) {
    return this.angularDb.object("roomsdetail/" + streamkey)
  }

  removeRoomsStream(streamkey) {
    this.angularDb.list("roomsdetail", ref => ref.orderByChild('isPotAllow').equalTo(streamkey)).remove()
    this.angularDb.list("liverooms/" + streamkey).remove()
  }



  updateThumpnail(streamkey) {
    let data = { thumpnail: "https://yortalk-mypot-st.nyc3.digitaloceanspaces.com/thump/" + streamkey + '.png' };
    var ref = firebase.database().ref("/live/" + streamkey);
    ref.update(data)

  }


  removeLiveStream() {
    this.angularDb.object("/accounts/" + firebase.auth().currentUser.uid + "/live").remove();
  }

  // Get Timeline of user
  getTimelines() {
    return this.angularDb.list(
      "/accounts/" + firebase.auth().currentUser.uid + "/timeline"
    ).snapshotChanges().take(1)
      .pipe(map(pages => { return pages.map(p => (this.extractFBData(p))); }));
  }

  // Get Timeline by user id
  getTimelineByUid(id) {
    return this.angularDb.object(
      "/accounts/" + id + "/timeline"
    ).snapshotChanges()
      .pipe(map(p => { return this.extractFBData(p) }))
  }

  // Get Timeline post
  getTimelinePost() {
    return this.angularDb.list("/timeline").snapshotChanges().take(1)
      .pipe(map(pages => { return pages.map(p => (this.extractFBData(p))); }));
  }

  getAllReportedPost() {
    return this.angularDb.list("/reportPost").snapshotChanges().take(1)
      .pipe(map(pages => { return pages.map(p => (this.extractFBData(p))); }));

  }

  // Get time line by id
  getTimeline(timelineId) {
    return this.angularDb.object("/timeline/" + timelineId)
  }

  // Get Friend List
  getFriends() {
    return this.angularDb.list(
      "/accounts/" + firebase.auth().currentUser.uid + "/friends"
    ).valueChanges().take(1)
    //.snapshotChanges()
    //.pipe(map(pages => { return pages.map(p => (this.extractFBData(p))); }));

  }

  // Get comments list
  getComments(postId) {
    return this.angularDb.list("/comments/" + postId).snapshotChanges().take(1)
      .pipe(map(pages => { return pages.map(p => (this.extractFBData(p))); }));
  }

  // Get likes
  getLike(postId) {
    return this.angularDb.list("/likes/" + postId).snapshotChanges().take(1)
      .pipe(map(pages => { return pages.map(p => (this.extractFBData(p))); }));
  }

  postLike(postId) {
    return this.angularDb.object("/likes/" + postId);
  }

  // Get likes
  getdisLike(postId) {
    return this.angularDb.list("/dislikes/" + postId).snapshotChanges().take(1)
      .pipe(map(pages => { return pages.map(p => (this.extractFBData(p))); }));
  }

  postdisLike(postId) {
    return this.angularDb.object("/dislikes/" + postId);
  }
  // post Comments
  postComments(postId) {
    return this.angularDb.object("/comments/" + postId);
  }

  // report post to admin
  getReportPost(postId) {
    console.log("postId", postId)
    return this.angularDb.object("/reportPost/" + postId)
      .snapshotChanges()
      .pipe(map(p => { return this.extractFBData(p) }));
  }

  // read contact
  getContact() {
    return new Promise(async (resolve, reject) => {
      //this.platform.i.ready().then(() => {
      if (!this.isContactGet && this.platform.is('capacitor')) {
        //alert(this.contacts)
        //if (this.platform.is('android')) {
        //  let permission = await Contacts.getPermissions();
        //  if (!permission.granted) {
        //    return;
        //  }
        //}

        //Contacts.getContacts().then(result => {
        //  console.log(result);
        //  this.userContactsList = [];
        //  let contacts = result.contacts;
        //  this.isContactGet = true;

        //  for (let i = 0; i < contacts.length; i++) {

        //    if (contacts[i].phoneNumbers) {
        //      // for(let j = 0; j < contacts[i].phoneNumbers.length; j++) {
        //      if (
        //        contacts[i].phoneNumbers[0].number.toString().charAt(0) ==
        //        "*" ||
        //        contacts[i].phoneNumbers[0].number.toString().charAt(0) == "#"
        //      ) {
        //      } else {
        //        let user = {
        //          name: this.getNameFromContact(
        //            contacts[i],
        //            contacts[i].phoneNumbers[0].number.toString()
        //          ),
        //          phoneNumber: contacts[i].phoneNumbers[0].number.toString()
        //        };
        //        this.userOnlyContacts.push(
        //          contacts[i].phoneNumbers[0].number.toString()
        //        );
        //        this.userContactsList.push(user);
        //      }
        //      // }
        //    }
        //  }
        //  resolve(this.userOnlyContacts);
        //  this.isContactGet = false;
        //}).catch((e) => reject(e));



        this.contacts.find(["*"], {}).then(
          contacts => {
            this.userContactsList = [];
            this.isContactGet = true;
            // this.contactlist = data
            for (let i = 0; i < contacts.length; i++) {
              ``
              if (contacts[i].phoneNumbers) {
                // for(let j = 0; j < contacts[i].phoneNumbers.length; j++) {
                if (
                  contacts[i].phoneNumbers[0].value.toString().charAt(0) ==
                  "*" ||
                  contacts[i].phoneNumbers[0].value.toString().charAt(0) == "#"
                ) {
                } else {
                  let user = {
                    name: this.getNameFromContact(
                      contacts[i],
                      contacts[i].phoneNumbers[0].value.toString()
                    ),
                    phoneNumber: contacts[i].phoneNumbers[0].value.toString()
                  };
                  this.userOnlyContacts.push(
                    contacts[i].phoneNumbers[0].value.toString()
                  );
                  this.userContactsList.push(user);
                }
                // }
              }
            }
            resolve(this.userOnlyContacts);
            this.isContactGet = false;
          },
          err => {
            reject(false);
          }
        );
      } else {
        resolve(this.userContactsList);
      }
    })
    //});
  }

  getNameFromContact(contact, number) {
    if (contact.name) {
      if (contact.name.formatted) {
        return contact.name.formatted;
      } else {
        return number;
      }
    } else {
      return number;
    }
  }

  setContactWithCountryCode(countryCode) {
    this.countryCode = countryCode;
    return new Promise((resolve, reject) => {
      async.map(
        this.userContactsList,
        (item, CB) => {
          this.checkContact(item, CB);
        },
        (err, results) => {
          // results is now an array of stats for each file
          if (err) {
            reject(false)
          } else {
            let contact = results;
            resolve(contact)
          }
        }
      );
    });
  }

  checkContact(item, callback) {
    let temp = item.phoneNumber.trim();
    temp = temp.split(")").join("");
    temp = temp.split("(").join("");
    temp = temp.split(" ").join("");
    temp = temp.replace(/\s/g, "");
    temp = temp.split("-").join("");
    if (temp.charAt(0) == "+") {
    } else if (temp.charAt(0) == "0" && temp.charAt(1) == "0") {
      let _tempConatct = "+" + temp.substr(2);
      item["phoneNumber"] = _tempConatct;
    } else if (temp.charAt(0) == "0") {
      let _tempConatct = this.countryCode + temp.substr(1);
      item["phoneNumber"] = _tempConatct;
    } else {
      let numberWithCountryCode = this.countryCode + temp;
      item["phoneNumber"] = numberWithCountryCode;
    }
    this.getUserWithPhonenumber(item.phoneNumber).subscribe((data: any) => {
      if (data.length > 0) {
        item["isUser"] = "1";
      } else {
        item["isUser"] = "0";
      }
    });
    callback(null, item);
  }

  // setContactWithCountryCode(countryCode) {
  //   // this.userContactsListWithCountryCode = [];
  //   return new Promise((resolve, reject) => {
  //     for (let i = 0; i < this.userContactsList.length; i++) {
  //       let temp = this.userContactsList[i].phoneNumber;
  //       temp = temp.split(")").join("");
  //       temp = temp.split("(").join("");
  //       temp = temp.split(" ").join("");
  //       temp = temp.replace(/\s/g, "");
  //       temp = temp.split("-").join("");

  //       if (temp.charAt(0) == "+") {
  //       } else if (temp.charAt(0) == "0" && temp.charAt(1) == "0") {
  //         let _tempConatct = "+" + temp.substr(2);
  //         this.userContactsList[i].phoneNumber = _tempConatct;
  //       } else if (temp.charAt(0) == "0") {
  //         let _tempConatct = countryCode + temp.substr(1);
  //         this.userContactsList[i].phoneNumber = _tempConatct;
  //       } else {
  //         let numberWithCountryCode = countryCode + temp;
  //         this.userContactsList[i].phoneNumber = numberWithCountryCode;
  //       }
  //     }
  //     resolve(this.userContactsList);
  //     this.checkUserExitsOrNot(this.userContactsList);
  //
  //   });
  // }

  async setData(key, val) {
    await Storage.set({
      key: key,
      value: JSON.stringify(val)
    });
  }

  getData(key) {
    return Storage.get({ key: key }).then(val => {
      return val.value;
    });
  }

  clearData() {
    Storage.clear();
    //this.storage.clear();
  }

  checkUserExitsOrNot(userContactsList) {
    this.exitsUserList = [];
    this.inviteUserList = [];
    userContactsList.forEach(contacts => {
      this.getUserWithPhonenumber(contacts.phoneNumber).subscribe((data: any) => {
        if (data.length > 0) {
          this.exitsUserList.push(userContactsList);
        } else {
          this.inviteUserList.push(userContactsList);
        }
      });
    });
  }

  removePost(post) {
    this.getUser(post.postBy)
      .valueChanges()
      //.snapshotChanges()
      //.pipe(
      //  map(p => {
      //    return this.extractFBData(p)
      //  })
      //)
      //.snapshotChanges()
      .take(1).subscribe((account: any) => {
        console.log("before timeline", timeline)
        var timeline = account.timeline;

        _.remove(timeline, (n) => {
          return n == post.$key
        });
        console.log("after timeline", timeline)
        // Add both users as friends.
        this.getUser(post.postBy).update({ timeline: timeline }).then((success) => {

          /**
           * Remove post from time line
          //  */
          this.getTimeline(post.$key).remove().then((success) => {
            this.angularDb.object('/reportPost/' + post.$key).remove();
          }).catch((error) => {
          })
        })
      })
  }

  ignorePost(post) {
    console.log("ingnore post ", post)
    this.angularDb.object('/reportPost/' + post.$key).remove()
  }

  unFriend(userId) {
    /**
     * Remove friend id from friend account
     */
    this.getUser(userId).snapshotChanges().take(1)
      .pipe(
        map(p => {
          return this.extractFBData(p)
        }))
      .subscribe((account) => {
        var friends = account.$val.friends;
        console.log("==friend List before", friends)
        if (friends) {
          _.remove(friends, (n) => {
            return n == firebase.auth().currentUser.uid
          });
          this.getUser(userId).update({
            friends: friends
          }).then((success) => {
          })
        }
        console.log("==friend List after", friends)

      })
    /**
     * Remove friend id from login user account
     */
    this.getUser(firebase.auth().currentUser.uid).snapshotChanges().take(1)
      .pipe(
        map(p => {
          return this.extractFBData(p)
        }))
      .subscribe((account: any) => {
        var friends = account.friends;
        console.log("==user List before", friends)
        if (friends) {
          _.remove(friends, (n) => {
            return n == userId
          });
          this.getUser(firebase.auth().currentUser.uid).update({
            friends: friends
          }).then((success) => {
          })
        }
        console.log("==user List after", friends)

      })
  }

  paginate(arr, size) {
    return arr.reduce((acc, val, i) => {
      let idx = Math.floor(i / size)
      let page = acc[idx] || (acc[idx] = [])
      page.push(val)

      return acc
    }, [])
  }




}
