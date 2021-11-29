import {Component, ElementRef, Input, Renderer2, ViewChild} from '@angular/core';
import { Platform } from '@ionic/angular';
//import { ViewController} from '@ionic/angular';
import {DataProvider} from '../../services/data'
import { Events } from '../../services/events';
import { Nav } from '../../services/nav';
//import { SocketioService } from '../../services/socketio.service';

/**
 * Generated class for the VideoCallPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
// @IonicPage()
@Component({
  selector: 'page-video-call',
  templateUrl: 'video-call.html',
  styleUrls: ['video-call.scss']
})
export class VideoCallPage {
  @ViewChild("mini") localView: ElementRef;
  @ViewChild("remote") remoteView: ElementRef;

  private width: number;
  private height: number;

  webRTCClient;
  showRemoteVideo= false;
  showHangup = false;
  isVideoMute;
  isAudioMute;
  constructor(public navCtrl: Nav,
    public events:Events,
    public dataProvider: DataProvider,
    //private cService: SocketioService,
    private platform: Platform,
    private renderer: Renderer2,  ) {
    platform.ready().then(() => {
      this.width = platform.width();
      this.height = platform.height();
    });
    this.webRTCClient = this.dataProvider.getwebRTCClient();
   
    console.log(this.webRTCClient)
    //console.log((<any>window).easyrtc)
    //this.webRTCClient = this.dataProvider.getwebRTCClient();
    //console.log("Calling from vidio", navCtrl.data)
    //this.webRTCClient.makeCall(navCtrl.data['calleeId'], navCtrl.data['useVideo'], this.miniView.nativeElement)
    //miniVideo
    //this.events.subscribe('userMediaSuccess', (e) => {

    ////"128px", "128px"
    //  //stream, divElement: ElementRef, videoCallId, width, height
    //  //this.cService.addStreamInDiv(e.stream, this.localView, 'miniElt-' + this.navCtrl.data['calleeId'], this.navCtrl.data['width'], this.navCtrl.data['height']);
    //})

    this.events.subscribe('addProducerMedia', (e) => {
    
     // this.webRTCClient.localMediaEl = this.localView.nativeElement;

      //this.webRTCClient.remoteVideoEl = this.remoteView.nativeElement;
      //this.webRTCClient.remoteAudioEl = this.remoteView.nativeElement;
      this.webRTCClient.produce(this.navCtrl.data['useVideo'], this.webRTCClient.device.id, this.navCtrl.data['calleeId'])
      
      //"128px", "128px"useVideo
      //stream, divElement: ElementRef, videoCallId, width, height
      //this.cService.addStreamInDiv(e.stream, this.localView, 'miniElt-' + this.navCtrl.data['calleeId'], this.navCtrl.data['width'], this.navCtrl.data['height']);
    })

    this.events.subscribe('remoteStreamAdded',(e)=>{
      this.showHangup = true;
      this.showRemoteVideo = true;
      setTimeout(() => {
        //this.cService.addStreamInDiv(e.stream, this.remoteView, 'remoteElt-' + this.navCtrl.data['calleeId'], this.navCtrl.data['width'], this.navCtrl.data['height']);
        //this.webRTCClient.addStreamInDiv(e.detail.stream, e.detail.callType, "remote", 'remoteElt-' + e.detail.callId, {
        //  width: "100%",
        //  height: "100%"
        //}, false);
      },2000)

    })

    this.events.subscribe('hangup',(e)=>{
      //this.RemoveMediaElements(e.detail.callId);
    })

    this.events.subscribe('rejectCall',(e)=>{
     // this.RemoveMediaElements(e);
    })
  }

  ngOnInit() {
    //this.webRTCClient = this.dataProvider.getwebRTCClient();
    //console.log(this.webRTCClient)
   
  }

  ngAfterViewInit() {
    //this.navCtrl.data['width'], this.navCtrl.data['height']
    var local = document.createElement('video')
    //local.width = this.navCtrl.data['width'];
    //local.height = this.navCtrl.data['height'];
    this.webRTCClient.width = this.navCtrl.data['width'];
    this.webRTCClient.height = this.navCtrl.data['height'];
    this.webRTCClient.localMediaEl = local;
    this.renderer.appendChild(this.localView.nativeElement, local);
    this.events.publish('addProducerMedia')
    console.log("Calling from vidio", this.navCtrl.data)
   // this.webRTCClient.makeCall(this.navCtrl.data['calleeId'], this.navCtrl.data['useVideo'], this.miniView.nativeElement)
  }


  ionViewWillLeave (){
    this.events.unsubscribe('userMediaSuccess')
    this.events.unsubscribe('remoteStreamAdded')
    this.events.unsubscribe('hangup')
    this.events.unsubscribe('rejectCall')
    this.HangUp();
    let callId = this.dataProvider.getIncomingCallid();
    this.RemoveMediaElements(callId);
  }

  RemoveMediaElements(callId) {
    //this.webRTCClient.removeElementFromDiv(this.localView);
   // this.webRTCClient.removeElementFromDiv(this.remoteView);
    //this.webRTCClient.removeElementFromDiv(this.remoteView, 'remoteElt-' + callId);
    this.navCtrl.closeModal();
  }

  HangUp(){
    //let callId = this.dataProvider.getIncomingCallid();
    //this.webRTCClient.hangUp(callId);
    this.navCtrl.closeModal();
  }

  toggleAudioMute(){
    this.webRTCClient.toggleAudioMute();
    this.isAudioMute = this.webRTCClient.isAudioMuted();
  }

  toggleVideoMute(){
    this.webRTCClient.toggleVideoMute();
    this.isVideoMute = this.webRTCClient.isVideoMuted();
  }



}
