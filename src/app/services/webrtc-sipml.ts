import { Injectable, Renderer2, RendererFactory2 } from "@angular/core";
import { Events } from "@ionic/angular";
//import SIPml from 'ecmascript-webrtc-sipml-2';
//import * as SIPml from '.'//'angular-webrtc-sipml';
//import { SIPml } from '../api-rtc/SIPml-api.js';
import { DataProvider } from "./data";
declare var SIPml: any;
 


@Injectable({
  providedIn: 'root'
})
export class WebrtcSipmlProvider {

  private renderer: Renderer2;
  serverIP_Url = "159.65.210.247";
  serverUDP_Port = 5060;
  userData;

  sTransferNumber;
  oRingTone; oRingbackTone;
  oSipStack; oSipSessionRegister; oSipSessionCall; oSipSessionTransferCall;
  videoRemote; videoLocal; audioRemote;
  bFullScreen = false;
  oNotifICall;
  bDisableVideo = false;
  viewVideoLocal; viewVideoRemote; viewLocalScreencast; // <video> (webrtc) or <div> (webrtc4all)
  oConfigCall;
  oReadyStateTimer;
  ringtone; ringbacktone; dtmfTone;

  constructor(
    private dataProvider: DataProvider,
    private rendererFactory: RendererFactory2,
    private events: Events) {
    this.renderer = rendererFactory.createRenderer(null, null);
    //this.dataProvider.getData("myPotProfileData").then((uData)=> this.userData = uData)
   // this.buildRingTone();
    
  }

  buildRingTone() {
    this.ringtone = this.renderer.createElement('audio');
    this.ringtone.setAttribute('src', 'assets/sounds/sounds_ringtone.wav');
    this.ringtone.setAttribute('autoplay', 'autoplay');
    this.ringtone.setAttribute('autoplay', true);

    this.ringbacktone = this.renderer.createElement('audio');
    this.ringbacktone.setAttribute('src', 'assets/sounds/sounds_ringbacktone.wav');
    this.ringbacktone.setAttribute('autoplay', 'autoplay');
    this.ringbacktone.setAttribute('loop', true);

    this.dtmfTone = this.renderer.createElement('audio');
    this.dtmfTone.setAttribute('src', 'assets/sounds/sounds_dtmf.wav');
  }


  sipRegister = () => {
    try {


      this.dataProvider.getData("myPotProfileData").then((uData) => {
        this.userData = JSON.parse(uData)

        console.log("SIPmlWebRTC", SIPml)
        // enable notifications if not already done
        // if (window.webkitNotifications && window.webkitNotifications.checkPermission() != 0) {
        //     window.webkitNotifications.requestPermission();
        // }

        //Notification.requestPermission();
        // save credentials
        //saveCredentials();

        // update debug level to be sure new values will be used if the user haven't updated the page
        //SIPml.setDebugLevel((window.localStorage && window.localStorage.getItem('org.doubango.expert.disable_debug') == "true") ? "error" : "info");
        //console.log("userProfileData", JSON.parse(uData))


        this.oSipStack = new SIPml.Stack({
          realm: this.serverIP_Url,//'example.org',
          impi: ""+this.userData.peerId,//'bob',
          impu: "sip:" + this.userData.peerId + "@" + this.serverIP_Url,//'sip:bob@example.org',
          password: "" +this.userData.peerId, // optional
          display_name: this.userData.displayName,//'I Am Legend', // optional
          //websocket_proxy_url: "wss://" + this.serverIP_Url + ":" + this.serverUDP_Port ,//'ws://192.168.0.10:5060', // optional
          websocket_proxy_url: "ws://" + this.serverIP_Url + ":" + this.serverUDP_Port,//+"/ws",
          outbound_proxy_url: "udp://" + this.serverIP_Url + ":" + this.serverUDP_Port, //'udp://192.168.0.12:5060', // optional
          ice_servers: [{ url: 'stun:stun.l.google.com:19302' }], // optional
          //bandwidth: { audio: 64, video: 512 }, // optional
          //video_size: { minWidth: 640, minHeight: 480, maxWidth: 1920, maxHeight: 1080 }, // optional
          enable_rtcweb_breaker: true, // optional
          enable_click2call: false, // optional
          events_listener: { events: '*', listener: this.onSipEventStack }, //optional
          sip_headers: [ //optional
            { name: 'User-Agent', value: 'IM-client/OMA1.0 sipML5-v1.0.89.0' },
            { name: 'Organization', value: 'Doubango Telecom' }
          ]
        });

        console.log(this.oSipStack)

     
        // create SIP stack
        //this.oSipStack =  SIPml.Stack({
        //  realm: this.serverIP_Url,//"xxx.xxx.xxx.xx",
        //  impi: this.userData.peerId,//"yyyy",
        //  impu: "sip:" + this.userData.peerId + "@" + this.serverIP_Url,//"sip:yyyy@xxx.xxx.xxx.xx",
        //  password: this.userData.peerId,//"yyyy",
        //  display_name: this.userData.displayName,//"yyyy",
        //  websocket_proxy_url: "wss://" + this.serverIP_Url + ":" + this.serverUDP_Port + "/ws",
        //  outbound_proxy_url: "",//(window.localStorage ? window.localStorage.getItem('org.doubango.expert.sip_outboundproxy_url') : null),
        //  ice_servers: "",//(window.localStorage ? window.localStorage.getItem('org.doubango.expert.ice_servers') : null),
        //  enable_rtcweb_breaker: "",//(window.localStorage ? window.localStorage.getItem('org.doubango.expert.enable_rtcweb_breaker') == "true" : false),
        //  events_listener: { events: '*', listener: this.onSipEventStack },
        //  enable_early_ims: "",//(window.localStorage ? window.localStorage.getItem('org.doubango.expert.disable_early_ims') != "true" : true), // Must be true unless you're using a real IMS network
        //  enable_media_stream_cache: "",//(window.localStorage ? window.localStorage.getItem('org.doubango.expert.enable_media_caching') == "true" : false),
        //  //bandwidth: (window.localStorage ? tsk_string_to_object(window.localStorage.getItem('org.doubango.expert.bandwidth')) : null), // could be redefined a session-level
        //  //video_size: (window.localStorage ? tsk_string_to_object(window.localStorage.getItem('org.doubango.expert.video_size')) : null), // could be redefined a session-level
        //  sip_headers: [
        //    { name: 'User-Agent', value: 'IM-client/OMA1.0 sipML5-v1.2016.03.04' },
        //    { name: 'Organization', value: 'SAGS Telecom' }
        //  ]
        //});
        //console.log(this.oSipStack)
        if (this.oSipStack.start() != 0) {
          console.log('<b>Failed to start the SIP stack</b>');
        }
        else return;
      })
    }
    catch (e) {
      console.log("<b>2:" + e + "</b>");
    }
    //btnRegister.disabled = false;


  }



  startRingTone = () => {

    try { this.ringtone.play(); }
    catch (e) { }
  }
  stopRingTone = () => {
    try { this.ringtone.pause(); }
    catch (e) { }
  }

  startRingbackTone = () => {
    try { this.ringbacktone.play(); }
    catch (e) { }
  }

  stopRingbackTone = () => {
    try { this.ringbacktone.pause(); }
    catch (e) { }
  }


  onSipEventStack = (e) => {
    console.log('==stack event = ' + e.type);
    switch (e.type) {
      case 'started':
        {
          // catch exception for IE (DOM not ready)
          try {
            // LogIn (REGISTER) as soon as the stack finish starting
            this.oSipSessionRegister = this.oSipStack.newSession('register', {
              expires: 200,
              events_listener: { events: '*', listener: this.onSipEventSession },
              sip_caps: [
                { name: '+g.oma.sip-im', value: null },
                //{ name: '+sip.ice' }, // rfc5768: FIXME doesn't work with Polycom TelePresence
                { name: '+audio', value: null },
                { name: 'language', value: '\"en,fr\"' }
              ]
            });
            this.oSipSessionRegister.register();
          }
          catch (e) {
            console.log("<b>1:" + e + "</b>");
            //btnRegister.disabled = false;
          }
          break;
        }
      case 'stopping': case 'stopped': case 'failed_to_start': case 'failed_to_stop':
        {
          var bFailure = (e.type == 'failed_to_start') || (e.type == 'failed_to_stop');
          this.oSipStack = null;
          this.oSipSessionRegister = null;
          this.oSipSessionCall = null;

          //uiOnConnectionEvent(false, false);

          this.stopRingbackTone();
          this.stopRingTone();

          //uiVideoDisplayShowHide(false);
          //divCallOptions.style.opacity = 0;

          //txtCallStatus.innerHTML = '';
          console.log(bFailure ? "<i>Disconnected: <b>" + e.description + "</b></i>" : "<i>Disconnected</i>")

          break;
        }

      case 'i_new_call':
        {
          if (this.oSipSessionCall) {
            // do not accept the incoming call if we're already 'in call'
            e.newSession.hangup(); // comment this line for multi-line support
          }
          else {
            this.oSipSessionCall = e.newSession;
            // start listening for events
            this.oSipSessionCall.setConfiguration(this.oConfigCall);

            alert("Answer / Reject")
            console.log("Answer / Reject")
            //uiBtnCallSetText('Answer');
            //btnHangUp.value = 'Reject';
            //btnCall.disabled = false;
            //btnHangUp.disabled = false;

            this.startRingTone();

            var sRemoteNumber = (this.oSipSessionCall.getRemoteFriendlyName() || 'unknown');
            console.log("<i>Incoming call from [<b>" + sRemoteNumber + "</b>]</i>");
            //showNotifICall(sRemoteNumber);
          }
          break;
        }

      case 'm_permission_requested':
        {
          //divGlassPanel.style.visibility = 'visible';
          break;
        }
      case 'm_permission_accepted':
      case 'm_permission_refused':
        {
          //divGlassPanel.style.visibility = 'hidden';
          if (e.type == 'm_permission_refused') {
            //uiCallTerminated('Media stream permission denied');
          }
          break;
        }

      case 'starting': default: break;
    }
  }
  onSipEventSession = (e) => {
    console.log('==session event = ' + e.type);

    switch (e.type) {
      case 'connecting': case 'connected':
        {
          var bConnected = (e.type == 'connected');
          if (e.session == this.oSipSessionRegister) {
            //uiOnConnectionEvent(bConnected, !bConnected);
            console.log("<i>" + e.description + "</i>");
          }
          else if (e.session == this.oSipSessionCall) {
            //btnHangUp.value = 'HangUp';
            //btnCall.disabled = true;
            //btnHangUp.disabled = false;
            //btnTransfer.disabled = false;
            //if (window.btnBFCP) window.btnBFCP.disabled = false;

            if (bConnected) {
              this.stopRingbackTone();
              this.stopRingTone();

              if (this.oNotifICall) {
                this.oNotifICall.cancel();
                this.oNotifICall = null;
              }
            }

            console.log("<i>" + e.description + "</i>");
            //divCallOptions.style.opacity = bConnected ? 1 : 0;

            if (SIPml.isWebRtc4AllSupported()) { // IE don't provide stream callback
              //uiVideoDisplayEvent(false, true);
              //uiVideoDisplayEvent(true, true);
            }
          }
          break;
        } // 'connecting' | 'connected'
      case 'terminating': case 'terminated':
        {
          if (e.session == this.oSipSessionRegister) {
            //uiOnConnectionEvent(false, false);

            this.oSipSessionCall = null;
            this.oSipSessionRegister = null;

            console.log("<i>" + e.description + "</i>");
          }
          else if (e.session == this.oSipSessionCall) {
            //uiCallTerminated(e.description);
          }
          break;
        } // 'terminating' | 'terminated'

      case 'm_stream_video_local_added':
        {
          if (e.session == this.oSipSessionCall) {
            //uiVideoDisplayEvent(true, true);
          }
          break;
        }
      case 'm_stream_video_local_removed':
        {
          if (e.session == this.oSipSessionCall) {
            //uiVideoDisplayEvent(true, false);
          }
          break;
        }
      case 'm_stream_video_remote_added':
        {
          if (e.session == this.oSipSessionCall) {
            //uiVideoDisplayEvent(false, true);
          }
          break;
        }
      case 'm_stream_video_remote_removed':
        {
          if (e.session == this.oSipSessionCall) {
            //uiVideoDisplayEvent(false, false);
          }
          break;
        }

      case 'm_stream_audio_local_added':
      case 'm_stream_audio_local_removed':
      case 'm_stream_audio_remote_added':
      case 'm_stream_audio_remote_removed':
        {
          break;
        }

      case 'i_ect_new_call':
        {
          this.oSipSessionTransferCall = e.session;
          break;
        }

      case 'i_ao_request':
        {
          if (e.session == this.oSipSessionCall) {
            var iSipResponseCode = e.getSipResponseCode();
            if (iSipResponseCode == 180 || iSipResponseCode == 183) {
              this.startRingbackTone();
              console.log('<i>Remote ringing...</i>');
            }
          }
          break;
        }

      case 'm_early_media':
        {
          if (e.session == this.oSipSessionCall) {
            this.stopRingbackTone();
            this.stopRingTone();
            console.log('<i>Early media started</i>');
          }
          break;
        }

      case 'm_local_hold_ok':
        {
          if (e.session == this.oSipSessionCall) {
            if (this.oSipSessionCall.bTransfering) {
              this.oSipSessionCall.bTransfering = false;
              // this.AVSession.TransferCall(this.transferUri);
            }
            //btnHoldResume.value = 'Resume';
            //btnHoldResume.disabled = false;
            //txtCallStatus.innerHTML = '<i>Call placed on hold</i>';
            this.oSipSessionCall.bHeld = true;
          }
          break;
        }
      case 'm_local_hold_nok':
        {
          if (e.session == this.oSipSessionCall) {
            this.oSipSessionCall.bTransfering = false;
            //btnHoldResume.value = 'Hold';
            //btnHoldResume.disabled = false;
            console.log('<i>Failed to place remote party on hold</i>');
          }
          break;
        }
      case 'm_local_resume_ok':
        {
          if (e.session == this.oSipSessionCall) {
            this.oSipSessionCall.bTransfering = false;
            //btnHoldResume.value = 'Hold';
            //btnHoldResume.disabled = false;
            //txtCallStatus.innerHTML = '<i>Call taken off hold</i>';
            this.oSipSessionCall.bHeld = false;

            if (SIPml.isWebRtc4AllSupported()) { // IE don't provide stream callback yet
              //uiVideoDisplayEvent(false, true);
              //uiVideoDisplayEvent(true, true);
            }
          }
          break;
        }
      case 'm_local_resume_nok':
        {
          if (e.session == this.oSipSessionCall) {
            this.oSipSessionCall.bTransfering = false;
            //btnHoldResume.disabled = false;
            console.log('<i>Failed to unhold call</i>')
          }
          break;
        }
      case 'm_remote_hold':
        {
          if (e.session == this.oSipSessionCall) {
            console.log('<i>Placed on hold by remote party</i>');
          }
          break;
        }
      case 'm_remote_resume':
        {
          if (e.session == this.oSipSessionCall) {
            console.log('<i>Taken off hold by remote party</i>');
          }
          break;
        }
      case 'm_bfcp_info':
        {
          if (e.session == this.oSipSessionCall) {
            console.log('BFCP Info: <i>' + e.description + '</i)>');
          }
          break;
        }

      case 'o_ect_trying':
        {
          if (e.session == this.oSipSessionCall) {
            console.log('<i>Call transfer in progress...</i>')
          }
          break;
        }
      case 'o_ect_accepted':
        {
          if (e.session == this.oSipSessionCall) {
            console.log('<i>Call transfer accepted</i>')
          }
          break;
        }
      case 'o_ect_completed':
      case 'i_ect_completed':
        {
          if (e.session == this.oSipSessionCall) {
            console.log('<i>Call transfer completed</i>')
            //btnTransfer.disabled = false;
            if (this.oSipSessionTransferCall) {
              this.oSipSessionCall = this.oSipSessionTransferCall;
            }
            this.oSipSessionTransferCall = null;
          }
          break;
        }
      case 'o_ect_failed':
      case 'i_ect_failed':
        {
          if (e.session == this.oSipSessionCall) {
            console.log('<i>Call transfer failed</i>');
            //btnTransfer.disabled = false;
          }
          break;
        }
      case 'o_ect_notify':
      case 'i_ect_notify':
        {
          if (e.session == this.oSipSessionCall) {
            console.log("<i>Call Transfer: <b>" + e.getSipRespo + " " + e.description + "</b></i>");
            if (e.getSipResponseCode() >= 300) {
              if (this.oSipSessionCall.bHeld) {
                this.oSipSessionCall.resume();
              }
              //btnTransfer.disabled = false;
            }
          }
          break;
        }
      case 'i_ect_requested':
        {
          if (e.session == this.oSipSessionCall) {
            var s_message = "Do you accept call transfer to [" + e.getTransferDestinationFriendlyName() + "]?";//FIXME
            if (confirm(s_message)) {
              console.log("<i>Call transfer in progress...</i>")
              this.oSipSessionCall.acceptTransfer();
              break;
            }
            this.oSipSessionCall.rejectTransfer();
          }
          break;
        }
    }
  }


}
