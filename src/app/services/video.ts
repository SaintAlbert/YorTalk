import { Inject, Injectable } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { NativeAudio } from '@ionic-native/native-audio';

import { mediaType } from '../../mediasoupclient/RoomClientMedia';

// Also using import with destructuring assignment.



//import 'rxjs/operator/map';
import { DataProvider } from './data';
import { AlertProvider } from './alert';
import { Events } from './events';
import { Nav } from './nav';
import { DOCUMENT } from '@angular/common';
import { SocketioService } from './socketio.service';
//import { WebrtcSipmlProvider } from './webrtc-sipml';

declare var apiRTC: any;
//declare var easyrtc: any;
declare var cordova: any;

declare var window: any;
//const  roomClient = new RoomClient();
/*
  Generated class for the VideoProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable({
  providedIn: 'root'
})
export class VideoProvider {
  webRTCClient;
  alert;
  document;

  private width: number;
  private height: number;

  constructor(@Inject(DOCUMENT) document, public platform: Platform,
    public alertCtrl: AlertController,
    public modalCtrl: Nav,
    public events: Events,
    public dataProvider: DataProvider,
    public alertProvider: AlertProvider,
    private nativeAudio: NativeAudio,
   // private cService: SocketioService,
   // private uRTCService: WebrtcSipmlProvider
   ) {
    this.platform.ready().then(() => {
      platform.ready().then(() => {
        this.width = platform.width();
        this.height = platform.height();
      });
      this.document = document;
      this.nativeAudio.preloadComplex('uniqueI1', 'assets/tone.mp3', 1, 1, 0).then((succ) => {

      }, (err) => {
      });
    })
  }

  InitializingRTC(userData) {
    if (this.platform.is('android')) {
      var permissions = cordova.plugins.permissions;
      // permissions.hasPermission(permissions.CAMERA, this.checkVideoPermissionCallback, null);
      // permissions.hasPermission(permissions.RECORD_AUDIO, this.checkAudioPermissionCallback, null);
      // permissions.hasPermission(permissions.BLUETOOTH_ADMIN, this.checkBluetoothPermissionCallback, null);
    }
    //apiRTC initialization
    if (userData) {
      //console.log(userData)
      //let userMetadata = userData["providerData"][0]
      //const uniqueId = userData.uid
      this.dataProvider.getUser(userData.uid).valueChanges().subscribe((data: any) => {
        // console.log(data.uniqueId)

        const conf = {
          //roomId: data.userId,
          peerId: data.uniqueId,
          displayName: data.username,
          userData: {
            profile: data.img,
            uniqueId: data.uniqueId,
            userId: data.userId,
            username: data.username,
            email: data.email,
            name: data.name,
            phoneNumber: data.phoneNumber
          }
        }
        //this.dataProvider.setData("myPotProfileData", conf)
        //  .then(() => this.cService.setupSocketConnection(conf).then((sockets: any) => {
        //    const { mediaRoomClient } = sockets;
        //    this.webRTCClient = mediaRoomClient;
        //    console.log(this.webRTCClient)
        //    this.sessionReadyHandler()
        //  }));
      })
    }
    //this.initApp();
  }


  checkVideoPermissionCallback(status) {
    var permissions = cordova.plugins.permissions;

    if (!status.hasPermission) {
      var errorCallback = function () {
        alert('Camera permission is not turned on');
      }
      permissions.requestPermission(
        permissions.CAMERA,
        function (status) {
          if (!status.hasPermission) {
            errorCallback();
          }
        },
        errorCallback);
    }
  }

  checkAudioPermissionCallback(status) {
    var permissions = cordova.plugins.permissions;
    if (!status.hasPermission) {
      var errorCallback = function () {
        alert('Audio permission is not turned on');
      }
      permissions.requestPermission(
        permissions.RECORD_AUDIO,
        function (status) {
          if (!status.hasPermission) {
            errorCallback();
          }
        },
        errorCallback);
    }
  }

  checkBluetoothPermissionCallback(status) {
    var permissions = cordova.plugins.permissions;

    if (!status.hasPermission) {
      var errorCallback = function () {
        alert('BLUETOOTH permission is not turned on');
      }
      permissions.requestPermission(
        permissions.BLUETOOTH_ADMIN,
        function (status) {
          if (!status.hasPermission) {
            errorCallback();
          }
        },
        errorCallback);
    }
  }
  async sessionReadyHandler() {
    this.dataProvider.setWebRTCClient(this.webRTCClient)
    //this.AddEventListeners();
  }


  streamCall(call) {
    // Hang up on an existing call if present
    if (window.existingCall) {
      window.existingCall.close();
    }

    // Wait for stream on the call, then set peerFactory video display
    call.on('stream', (stream) => {
      this.events.publish('remoteStreamAdded', { stream: stream});
      //$('#their-video').prop('src', URL.createObjectURL(stream));
    });
    // UI stuff
    window.existingCall = call;
    console.log(call)
   // $('#their-id').text(call.peerFactory);
    call.on('error', function () {
      var i = 0;
    });
  }

  streamMakeCall(call) {
    // Hang up on an existing call if present
    if (window.existingCall) {
      window.existingCall.close();
    }

    // Wait for stream on the call, then set peerFactory video display
    call.on('stream', (stream) => {
      //this.events.publish('userMediaSuccess', { stream: stream });
      //this.events.publish('remoteStreamAdded', { stream: stream });
      //$('#their-video').prop('src', URL.createObjectURL(stream));
      //this.events.publish('openVideocall')
      //this.events.publish('userMediaSuccess', { stream: stream });
    });
    // UI stuff
    window.existingCall = call;
    console.log(call.peerFactory)
    // $('#their-id').text(call.peerFactory);
    call.on('error', function () {
      var i = 0;
    });
  }


  AddEventListeners() {

    // Receiving a call
    this.webRTCClient.on('call', async function (call) {
      // Answer the call automatically (instead of prompting user) for demo purposes
      //this.events.publish('openVideocall');
      this.nativeAudio.loop('uniqueI1').then((succ) => {
      }, (err) => {
      });
      this.alert = this.alertCtrl.create({
        header: 'INCOMING CALL ',
        // subTitle: '<img src="assets/calling.gif"><br><p>Call from 96325 ...</p>',
        subHeader: '<img src="assets/call-me.gif"><br><p>Call from ' + call.id + ' ...</p>',
        cssClass: 'outgoingcall incomingcall',
        backdropDismiss: false,
        //enableBackdropDismiss:false,
        buttons: [
          {
            text: 'Reject',
            role: 'cancel',
            cssClass: 'reject',
            handler: () => {
              this.nativeAudio.stop('uniqueI1')
              this.RejectCall(call);
            }
          },
          {
            text: 'Answer',
            cssClass: 'answer',
            handler: () => {
              this.nativeAudio.stop('uniqueI1')
              this.AnswerCall(call);

            }
          }
        ]
      });
      this.alert.present();



      //var r = confirm('Ny kald fra ');
      //if (r) {
      //  var localStream = await this.cService.getWebcamResolution("hd", true)
      //  call.answer(localStream);
      //  //$scope.currentCall = true;
      //  //$scope.$apply();
      //  this.streamCall(call);
      //}
      //else {
      //  call.close();
      //  window.existingCall.close();
      //}
    });




    //apiRTC.addEventListener("userMediaSuccess", (e) => {
    //  this.events.publish('userMediaSuccess', e)
    //})
    //apiRTC.addEventListener("userMediaError", (e) => {
    //  this.alert.dismiss()
    //})
    //apiRTC.addEventListener("incomingCall", (e) => {
    //  this.events.publish('openVideocall');
    //  this.nativeAudio.loop('uniqueI1').then((succ) => {
    //  }, (err) => {
    //  });
    //  this.alert = this.alertCtrl.create({
    //    header: 'INCOMING CALL ',
    //    // subTitle: '<img src="assets/calling.gif"><br><p>Call from 96325 ...</p>',
    //    subHeader: '<img src="assets/call-me.gif"><br><p>Call from ' + e.detail.callerNickname + ' ...</p>',
    //    cssClass: 'outgoingcall incomingcall',
    //    backdropDismiss: false,
    //    //enableBackdropDismiss:false,
    //    buttons: [
    //      {
    //        text: 'Reject',
    //        role: 'cancel',
    //        cssClass: 'reject',
    //        handler: () => {
    //          this.nativeAudio.stop('uniqueI1')
    //          this.RejectCall(e.detail.callId);
    //        }
    //      },
    //      {
    //        text: 'Answer',
    //        cssClass: 'answer',
    //        handler: () => {
    //          this.nativeAudio.stop('uniqueI1')
    //          this.AnswerCall(e.detail.callId);

    //        }
    //      }
    //    ]
    //  });
    //  this.alert.present();
    //})

    //apiRTC.addEventListener("hangup", (e) => {
    //  this.events.publish('hangup', e);
    //  this.alertProvider.showToast(e.detail.reason);
    //  this.nativeAudio.stop('uniqueI1')

    //  this.alert.dismiss();
    //})
    //apiRTC.addEventListener("remoteStreamAdded", (e) => {
    //  this.events.publish('remoteStreamAdded', e)
    //  this.alert.dismiss();

    //})
    //apiRTC.addEventListener("webRTCClientCreated", (e) => {
    //  this.webRTCClient.setAllowMultipleCalls(true);
    //  this.webRTCClient.setVideoBandwidth(300);
    //  this.webRTCClient.setUserAcceptOnIncomingCall(true);
    //})
  }
  async MakeCall(calleeId) {
    //console.log(calleeId)
    //var data = { calleeId: calleeId, useVideo: true }
    this.modalCtrl.data = {
      calleeId: calleeId, useVideo: mediaType.video , width:this.width,
      height:this.height };

    this.events.publish('openVideocall')
    //this.events.publish('addProducerMedia')
    //
    //
   // var localStream = await this.cService.getWebcamResolution(true, this.width, this.height)
   // var call = this.webRTCClient.call(calleeId, localStream);
    //console.log(call)
    
   // this.events.publish('userMediaSuccess', { stream: localStream });
   // this.streamMakeCall(call);
    //this.events.publish('openVideocall')
    //this.events.publish('userMediaSuccess', { stream: localStream });
    //$scope.currentCall = true;
    //streamCall(call);
    //this.roomMediasoupClient.makeCall(calleeId)
    //var callId = this.webRTCClient.call(calleeId);
    //if (callId != null) {
    //  //this.incomingCallId = callId;
    //  this.dataProvider.setIncomingCallId(callId)
    //  this.alert = this.alertCtrl.create({
    //    header: "OUTGOING CALL",
    //    subHeader: '<img src="assets/call-me.gif"><br><p>Call to ' + callId + '</p>',
    //    buttons: [{
    //      text: 'Dismiss',
    //      role: 'cancel',
    //      handler: () => {
    //        this.RejectCall(callId)
    //      }
    //    }],
    //    cssClass: 'outgoingcall ',
    //    backdropDismiss: false
    //    //enableBackdropDismiss:false
    //  });
    //  this.alert.present();


    //}
  }


  async AnswerCall(call,incomingCallId) {
    this.dataProvider.setIncomingCallId(incomingCallId)
    //var localStream = await this.cService.getWebcamResolution(true,this.width, this.height)
   // call.answer(localStream);
    this.streamCall(call);

    //this.webRTCClient.acceptCall(incomingCallId);
    //var r = confirm('Ny kald fra ');
    //if (r) {
    //  var localStream = await this.cService.getWebcamResolution("hd", true)
    //  call.answer(localStream);
    //  //$scope.currentCall = true;
    //  //$scope.$apply();
    //  this.streamCall(call);
    //}
    //else {
    //  call.close();
    //  window.existingCall.close();
    //}
  }
  _webRTCClinetref() {
    return this.webRTCClient
  }

  RejectCall(call) {
    this.alert.dismiss();
    //this.webRTCClient.refuseCall(incomingCallId);
    this.events.publish('rejectCall', this.modalCtrl.data.calleeId)
    window.existingCall.close();
    call.close();
    // this.RemoveMediaElements(incomingCallId);
  }




}
