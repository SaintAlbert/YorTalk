import { Component, ElementRef, ViewChild } from '@angular/core';
import { Platform } from '@ionic/angular';
import firebase from 'firebase/app';
import {  map } from 'rxjs/operators';
import { AppComponent } from '../../app.component';

import { DataProvider } from '../../services/data';
import { LoadingProvider } from '../../services/loading';
import { Nav } from '../../services/nav';
import { Queue } from '../../services/queue';


declare var MediaRecorder: any;
//C:\source\philip\esocial_dev_v4\YorTalk\src\assets\dollars\1-dollars.png

@Component({
  selector: 'page-new-live-room',
  templateUrl: 'new-live-room.html',
  styleUrls: ['new-live-room.scss']
})
export class NewLiveRoomPage {
  private friends: any;
  private searchFriend: any;
  private user: any;

  secondsPassed = 0;
  oldTimeStamp = 0;
  movingSpeed = 50;

  @ViewChild("myCanvas", { static: true }) canvas: ElementRef<HTMLCanvasElement>; // get the canvas from the page
  @ViewChild("myVideo", { static: false }) myVideo: ElementRef<HTMLVideoElement>;

  //For Live Video Canvas
  queue = new Queue();
  useScale = false;
  muted = true;
  ctx: CanvasRenderingContext2D

  //Toggle view Control
  showGiving = false;
  showControl = true;

  //Live Data
  liveData$: any
  socketdata = {};

  //For Camera Constrain
  videoContainer; // object to hold video and associated info
  stream: any;
  streamdata: any;
  mediaRecorder: any;
  front = true;
  constraints = {
    audio: true,
    video: {
      //width: {
      //  ideal: screen.width
      //},
      //height: {
      //  ideal: screen.height
      //}
    },
    facingMode: { exact: (this.front ? "user" : "environment") }
  };

  //For Giving / Currency
  dolarImages = [
    { dollar: '../../../assets/dollars/1-dollars.png', value: 1 },
    { dollar: '../../../assets/dollars/2-dollars.png', value: 2 },
    { dollar: '../../../assets/dollars/5-dollars.png', value: 5 },
    { dollar: '../../../assets/dollars/10-dollars.png', value: 10 },
    { dollar: '../../../assets/dollars/20-dollars.png', value: 20 },
    { dollar: '../../../assets/dollars/50-dollars.png', value: 50 },
    { dollar: '../../../assets/dollars/100-dollars.png', value: 100 }
  ];
  givingArray = [];
  imageDolar = new Image();
  imageUser = new Image();
  dollarIndex = 0;
  dollarElement = null;
  userImage: any;


  //For socket
  outPutUrl = ""//'rtmp://127.0.0.1:1935/stream/';
  //wsServerURL = "ws://127.0.0.1:8000";
  //httpServerURL = "http://127.0.0.1:8001";
  // NewMessagePage
  // This is the page where the user are asked to select a friend whom they want to start a conversation with.
  constructor(public navCtrl: Nav, public dataProvider: DataProvider,
    public loadingProvider: LoadingProvider, private platform: Platform,
    private parentSocket: AppComponent
    //private ffmpg: FFMPEGProvider
    //private socket: DataSocketService
  ) {
    platform.ready().then(() => {
      //this.constraints.video.height.ideal = platform.height();
      //this.constraints.video.width.ideal = platform.width();
    });

   
  }


  ngOnInit() {

    this.parentSocket.SocketInstance.getMessages().subscribe((data) => {
      console.log(data)
    })

    this.sendServerMessage('start-ffmpeg', "5fttggd");

    //this.socket.connectToWebsocket();
    //this.socket.getMessages().subscribe((data) => {
    //  console.log(data)
    //})
    //this.socket.connect({ reconnect: true });
 
    //this.socket.connectToWebsocket().subscribe(
    //  msg => console.log('message received: ' + msg),
    //  // Called whenever there is a message from the server
    //  err => console.log(err),
    //  // Called if WebSocket API signals some kind of error
    //  () => console.log('complete')
    //  // Called when connection is closed (for whatever reason)
    //);
    //this.socket.sendMessage({ 'userdata': 'Called when connection is Open'});

    

    //this.liveData$ = this.socket.messages$.pipe(
    //  map((rows: any) => rows.data),
    //  catchError(error => { throw error }),
    //  tap({
    //    error: error => console.log('[Live component] Error:', error),
    //    complete: () => console.log('[Live component] Connection Closed')
    //  }));


    // Initialize
    this.searchFriend = '';
    this.loadingProvider.show();
    this.ctx = this.canvas.nativeElement.getContext('2d');
    

    this.dataProvider.getUser(firebase.auth().currentUser.uid)
      .snapshotChanges()
      .pipe(map(p => { return this.dataProvider.extractFBData(p) }))
      .subscribe((user: any) => {
        this.user = user;
        if (user.img)
          this.userImage = user.img;
        else
          this.userImage = '../../../assets/images/profile.png';
      });

    //Get User media 
    if (navigator.mediaDevices.getUserMedia) {
      this.FindMaximum_WidthHeight_ForCamera();
    } else {
      this.back();
    }

    // Get user's friends.
    this.dataProvider.getCurrentUser().subscribe((account: any) => {
      if (account.friends) {
        for (var i = 0; i < account.friends.length; i++) {
          this.dataProvider.getUser(account.friends[i]).valueChanges().subscribe((friend) => {
            this.addOrUpdateFriend(friend);
          });
        }
      } else {
        this.friends = [];
      }
      this.loadingProvider.hide();
    });
  }

  ngAfterViewInit() {

    // the video will now begin to load.
    // As some additional info is needed we will place the video in a
    // containing object for convenience
    this.myVideo.nativeElement.autoplay = true; // ensure that the video does not auto play
    this.myVideo.nativeElement.loop = true; // set the video to loop.
    //this.myVideo.nativeElement.muted = true;
    //this.myVideo.nativeElement.muted = this.muted;

    this.videoContainer = {  // we will add properties as needed
      video: this.myVideo.nativeElement,
      ready: false,
    };


    // To handle errors. This is not part of the example at the moment. Just fixing for Edge that did not like the ogv format video
    this.myVideo.nativeElement.onerror = function (e) {
      console.log("Video Error:", e)
      //document.body.removeChild(canvas);
      //document.body.innerHTML += "<h2>There is a problem loading the video</h2><br>";
      //document.body.innerHTML += "Users of IE9+ , the browser does not support WebM videos used by this demo";
      //document.body.innerHTML += "<br><a href='https://tools.google.com/dlpage/webmmf/'> Download IE9+ WebM support</a> from tools.google.com<br> this includes Edge and Windows 10";

    }

    this.myVideo.nativeElement.oncanplay = (event) => {
      console.log(event)
      this.readyToPlayVideo(event);
    } // set the event to the play function that

  }

  // Back
  back() {
    if (this.mediaRecorder)
      this.mediaRecorder.stop();

    if (this.stream)
      for (let track of this.stream.getTracks()) {
        track.stop()
      }
    this.sendServerMessage('end-ffmpeg',null);
    //if (this.socket)
    //  this.socket.close();
      //this.socket.close();

    this.navCtrl.back();
    //this.navCtrl.pop("messages");
  }

  startGiving() {
    this.showGiving = !this.showGiving;
    this.showControl = !this.showControl;
    console.log(this.showGiving)
  }

  toggleControl() {
    this.showControl = !this.showControl;
    if (this.showGiving)
      this.showGiving = false;
    //this.showGiving = !this.showGiving;
  }

  rotate() {
    this.front = !this.front;
  }

  endLiveStream() {
    var streamdata = (this.canvas.nativeElement as any).captureStream(30);// 30 FPS

    const recorderOptions = {
      //mimeType: "video/webm;codecs=H264",
      //videoBitsPerSecond: 3 * 1024 * 1024,
      mimeType: 'video/webm',
      videoBitsPerSecond: 3000000
    };
    this.mediaRecorder = new MediaRecorder(streamdata,
      recorderOptions
      //{
      //mimeType: 'video/webm;codecs=h264',
      //videoBitsPerSecond: 3000000
      //}
    );
   
    //this.ffmpg.pushLiveVideo(this.streamdata,"5fttggd")
    this.mediaRecorder.addEventListener('dataavailable', (e) => {
      //ws.send(e.data);
      if (e.data && e.data.size > 0) {
        this.pushLiveVideo(e.data)
      }
      
    });

    // mediaRecorder.addEventListener('stop', ws.close.bind(ws));

    this.mediaRecorder.start(1000); // Start recording, and dump data every second
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
    this.navCtrl.push('message', { userId: userId });
  }


  readyToPlayVideo(event) { // this is a referance to the video
    // the video may not match the canvas size so find a scale to fit
    // set internal canvas size to match HTML element size
    this.canvas.nativeElement.width = this.canvas.nativeElement.scrollWidth;
    this.canvas.nativeElement.height = this.canvas.nativeElement.scrollHeight;

    this.videoContainer.scale = Math.min(
      this.canvas.nativeElement.width / this.videoContainer.video.videoWidth,
      this.canvas.nativeElement.height / this.videoContainer.video.videoHeight);
    this.videoContainer.ready = true;
    // the video can be played so hand it off to the display function

    // Calculate how much time has passed
    //var timeStamp = Math.floor(Date.now() / 1000);
    //this.secondsPassed = (timeStamp - this.oldTimeStamp) / 1000;
    //this.oldTimeStamp = timeStamp;
    requestAnimationFrame(() => { this.updateCanvas() });
    this.dequeueLoop();
    // add instruction
    // document.getElementById("playPause").textContent = "Click video to play/pause.";
    // document.querySelector(".mute").textContent = "Mute";
  }


  dequeueLoop = () => {   //  create a loop function
    let i = 0;
    setTimeout(() => {   //  call a 3s setTimeout when the loop is called
      i++;                    //  increment the counter
      if (i < 10) {           //  if the counter < 10, call the loop function
        this.dequeueLoop();             //  ..  again which will trigger another
      }
      //console.log('hello', i);//  ..  setTimeout()
      if (!this.queue.isEmpty()) {
        this.queue.dequeue()
        this.secondsPassed = 0;
        this.oldTimeStamp = 0;
      }
    }, 5000)

  }


  updateCanvas() {

    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    // only draw if loaded and ready
    if (this.videoContainer !== undefined && this.videoContainer.ready) {

      var scale = this.videoContainer.scale;
      var vidH = this.videoContainer.video.videoHeight;
      var vidW = this.videoContainer.video.videoWidth;

      var videoSize = { width: this.videoContainer.video.videoWidth, height: this.videoContainer.video.videoHeight };
      var canvasSize = { width: this.canvas.nativeElement.width, height: this.canvas.nativeElement.height };
      var renderSize = this.calculateSize(videoSize, canvasSize);

      var top = 0, left = 0;
      if (this.useScale) {
        top = 0//this.canvas.nativeElement.height / 2 - (vidH / 2) * scale;
        left = this.canvas.nativeElement.width / 2 - (vidW / 2) * scale;
        this.ctx.drawImage(this.videoContainer.video, left, top, vidW * scale, vidH * scale);
      } else {

        var xOffset = (canvasSize.width - renderSize.width) / 2;
        this.ctx.drawImage(this.videoContainer.video, xOffset, top, renderSize.width, renderSize.height);
      }

      if (!this.queue.isEmpty()) {
        this.drawDolarOnScreen(this.queue.front());
      }

      if (this.videoContainer.video.paused) { // if not playing show the paused screen
        //drawPayIcon();
      }
    }
    //this.ffmpg.pushLiveVideo(stream, key, {}, switchkey, youtubekey, facebookkey)
    // all done for display 
    // request the next frame in 1/60th of a second
    requestAnimationFrame(() => { this.updateCanvas() });
  }


  drawPayIcon() {
    this.ctx.fillStyle = "black";  // darken display
    this.ctx.globalAlpha = 0.5;
    this.ctx.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.ctx.fillStyle = "#DDD"; // colour of play icon
    this.ctx.globalAlpha = 0.75; // partly transparent
    this.ctx.beginPath(); // create the path for the icon
    var size = (this.canvas.nativeElement.height / 2) * 0.5;  // the size of the icon
    this.ctx.moveTo(this.canvas.nativeElement.width / 2 + size / 2, this.canvas.nativeElement.height / 2); // start at the pointy end
    this.ctx.lineTo(this.canvas.nativeElement.width / 2 - size / 2, this.canvas.nativeElement.height / 2 + size);
    this.ctx.lineTo(this.canvas.nativeElement.width / 2 - size / 2, this.canvas.nativeElement.height / 2 - size);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.globalAlpha = 1; // restore alpha
  }

  dollarUpdate(n) {
    var d = this.dolarImages[n];
    this.queue.enqueue(d);
    console.log(this.streamdata)
  }

  drawDolarOnScreen(dol) {
    // Use time to calculate new position
    this.ctx.save();
    this.secondsPassed++;
    this.imageDolar.src = dol.dollar;
    this.imageUser.src = this.userImage;
    this.imageUser.className = "imageProfile";
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
    //this.ctx.rotate((Math.PI / 180) * 5);
    this.ctx.rotate((Math.PI / 180) * 10);
    this.ctx.drawImage(this.imageDolar, (this.platform.width() / 14) + this.secondsPassed, (this.platform.height() / 2.5), 200, 100);
    this.ctx.drawImage(this.imageUser, (this.platform.width() / 14) + this.secondsPassed, (this.platform.height() / 1.85), 40, 40);
    this.ctx.font = '12px Sans-Serif';
    this.ctx.fillStyle = "white"
    //3.6
    this.ctx.fillText(this.user.name + ' gives $' + dol.value, (this.platform.width() / 5.6) + this.secondsPassed, (this.platform.height() / 1.75));
    this.ctx.restore();
    //this.drawLove()
  }


  drawSpeech() {

    // Quadratric curves example
    this.ctx.beginPath();
    this.ctx.moveTo(75, 25);
    this.ctx.quadraticCurveTo(25, 25, 25, 62.5);
    this.ctx.quadraticCurveTo(25, 100, 50, 100);
    this.ctx.quadraticCurveTo(50, 120, 30, 125);
    this.ctx.quadraticCurveTo(60, 120, 65, 100);
    this.ctx.quadraticCurveTo(125, 100, 125, 62.5);
    this.ctx.quadraticCurveTo(125, 25, 75, 25);
    this.ctx.stroke();

  }


  drawLove() {

    // Cubic curves example
    this.ctx.beginPath();
    this.ctx.moveTo(75, 40);
    this.ctx.bezierCurveTo(75, 37, 70, 25, 50, 25);
    this.ctx.bezierCurveTo(20, 25, 20, 62.5, 20, 62.5);
    this.ctx.bezierCurveTo(20, 80, 40, 102, 75, 120);
    this.ctx.bezierCurveTo(110, 102, 130, 80, 130, 62.5);
    this.ctx.bezierCurveTo(130, 62.5, 130, 25, 100, 25);
    this.ctx.bezierCurveTo(85, 25, 75, 37, 75, 40);
    this.ctx.fill();

  }

  playPauseClick() {
    if (this.videoContainer !== undefined && this.videoContainer.ready) {
      if (this.videoContainer.video.paused) {
        this.videoContainer.video.play();
      } else {
        this.videoContainer.video.pause();
      }
    }
  }
  //videoMute() {
  //muted = !muted;
  //if (muted) {
  //  document.querySelector(".mute").textContent = "Mute";
  //} else {
  //  document.querySelector(".mute").textContent = "Sound on";
  //}
  //}



  calculateSize(srcSize, dstSize) {
    var srcRatio = srcSize.width / srcSize.height;
    var dstRatio = dstSize.width / dstSize.height;
    if (dstRatio > srcRatio) {
      return {
        width: dstSize.height * srcRatio,
        height: dstSize.height
      };
    } else {
      return {
        width: dstSize.width,
        height: dstSize.width / srcRatio
      };
    }
  }



  FindMaximum_WidthHeight_ForCamera() {
    console.log(this.constraints)
    navigator.mediaDevices.getUserMedia(this.constraints).then(this.checkSuccess).catch(this.checkError);
  }


  checkSuccess = (stream) => {

    this.stream = stream;
    this.myVideo.nativeElement.srcObject = stream;
    //
    this.loadingProvider.hide();

  }

  checkError = (error) => {
    this.back();
  }


  sendServerMessage(eventType, msgData: any) {
    this.parentSocket.SocketInstance.sendMessage(eventType, msgData);
  }

  pushLiveVideo(streamInput) {
    this.sendServerMessage('stream-to-room', { stream: streamInput});
  }


  pushLiveVideoWithExternal(streamInput, streamKey, twitchKey = '', youtubeKey = '', facebookKey = '') {
    // raw call of ffmpeg (source(s), arguments, target, progress callback)
    var url = this.outPutUrl + streamKey;
    var param = this.buildParam(twitchKey, youtubeKey, facebookKey);
    if (param) {
      this.outPutUrl = "?" + param;
    }
    console.log(this.outPutUrl)
    this.sendServerMessage('post_stream', { stream: streamInput, rtmpUrl: url });

  }

  buildParam(twitchKey, youtubeKey, facebookKey) {
    var param;
    if (twitchKey) {
      param = "twitch=" + twitchKey;
    }
    if (youtubeKey) {
      if (param)
        param = param + "&youtube=" + youtubeKey;
      else
        param = "youtube=" + youtubeKey;
    }

    if (facebookKey) {
      if (param)
        param = param + "&facebook=" + facebookKey;
      else
        param = "facebook=" + facebookKey;
    }

    return param;
  }



}
