import { io, Socket } from 'socket.io-client';
import * as mediasoupClient from 'mediasoup-client';
import { getTCPUrl, getLocalTCPUrl } from '../../mediasoupclient/urlFactory';
import { RoomClientMedia } from '../../mediasoupclient/RoomClientMedia';
// The usage -
//import Peer from 'peerjs';
import { ElementRef, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Events } from '@ionic/angular';

const VIDEO_CONSTRAINS =
{
  qvga: { width: { ideal: 320 }, height: { ideal: 240 } },
  vga: { width: { ideal: 640 }, height: { ideal: 480 } },
  hd: { width: { ideal: 1280 }, height: { ideal: 720 } }
};


@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  socket: Socket;
  peer;
  device;
  producer;

  ringtone; ringbacktone; dtmfTone;

  sendProduceTransport; recvConsumeTransport;



  private renderer: Renderer2;
  constructor(
    //private renderer: Renderer2,
    private rendererFactory: RendererFactory2,
    public events: Events) {
    this.renderer = rendererFactory.createRenderer(null, null);
    //this.buildRingTone();
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



  setupSocketConnection(conf) {
    return new Promise((resolve, reject) => {
      const { peerId, displayName, userData } = conf;
      //console.log(conf)
      //this.socket = io(getTCPUrl(peerId));
      this.socket = io(getLocalTCPUrl());

      this.socket.on('connect', () => {
        resolve({ mediaRoomClient: new RoomClientMedia(mediasoupClient, this.socket, peerId, displayName, userData, (d) => { console.log("Room Client Done:- " + d) })  });
      });

      this.socket.on('reconnect', () => {
        resolve({ mediaRoomClient: new RoomClientMedia(mediasoupClient, this.socket, peerId, displayName, userData, (d) => { console.log("Room Client Done:- " + d) }) });
      });

      // this.on("connection", (data) => { console.log(data) })
    })
  }

  createRoom(roomId, peerId) {
    this.socket.emit('createRoom', { room_id: peerId }, async (data) => { console.log(data) })
    console.log('socket.io is connected.')
  }

  /**Peers RTC section */
  getRTCPeerSocket() {
    return this.peer;
  }

  addStreamInDiv(stream, divElement: ElementRef, videoCallId, width, height) {
    //'miniElt-' + e.detail.callId
    //width: "128px",
    //height: "128px"
    this.onaddstream(stream, divElement, videoCallId, width, height);
  }

  onaddstream(streams, divElement: ElementRef, videoCallId, width, height) {
    let childVid = this.renderer.createElement('video');

    childVid.setAttribute("id", videoCallId);
    //childVid.width = width;
    //childVid.height = height;
    childVid.setAttribute('width', width);
    childVid.setAttribute('height', height);
    childVid.setAttribute('autoplay', 'autoplay');
    childVid.setAttribute('playsinline', 'playsinline');
    //childVid.setAttribute('srcObject', streams[0]);
    //childVid.srcObject = streams[0];
    childVid.srcObject = streams;

    this.renderer.appendChild(divElement.nativeElement, childVid);
    childVid.play();
    console.log(divElement.nativeElement)
  }

  removeElementFromDiv(divElement: ElementRef) {
    Array.from(divElement.nativeElement.children).forEach(child => {
      console.log('children.length=' + divElement.nativeElement.children.length);
      this.renderer.removeChild(divElement.nativeElement, child);
    });
  }


  async getWebcamResolution(callType = true, width, height) {
    //let _webcam = 'hd'
    try {
      //switch (resolution) {
      //  case 'qvga':
      //    _webcam = 'vga';
      //    break;
      //  case 'vga':
      //    _webcam = 'hd';
      //    break;
      //  case 'hd':
      //    _webcam = 'qvga';
      //    break;
      //  default:
      //    _webcam = 'hd';
      //}

      console.log('changeWebcamResolution() | calling getUserMedia()');

      const stream = await navigator.mediaDevices.getUserMedia(
        {
          audio: callType,
          video:
          {
            // deviceId: { exact: this._webcam.device.deviceId },
            //...VIDEO_CONSTRAINS[resolution]
            width: { ideal: width }, height: { ideal: height }
          }
        });

      //const track = stream.getVideoTracks()[0];

      //await this._webcamProducer.replaceTrack({ track });
      // this.events.publish('userMediaSuccess', { stream: stream});
      return stream;
    }
    catch (error) {
      console.log('changeWebcamResolution() | failed: %o', error);
    }
  }


  /**End Peers RTC section */

  /**
   * emits socket event to get mediasoup supported RTP capabilities
   * @param video 
   * @param video2 
   */
  initializeMediaSoup(video, video2) {
    this.socket.emit('getRouterRtpCapabilities', null, async (data) => {
      await this.loadDevice(data);
      this.publish(video);
      this.subscribe(video2);
    });
  }

  /**
   * Loads the device with the RTP capabilities of the mediasoup router
   * @param routerRtpCapabilities 
   */
  async loadDevice(routerRtpCapabilities) {
    try {
      this.device = new mediasoupClient.Device();
    } catch (error) {
      if (error.name === 'UnsupportedError') {
        console.error('browser not supported');
      }
    }
    await this.device.load({ routerRtpCapabilities });
  }

  /**
   * Creates a new WebRTC transport to send media
   * @param video 
   */
  async publish(video) {
    this.socket.emit(
      'createProducerTransport',
      {
        forceTcp: false,
        rtpCapabilities: this.device.rtpCapabilities,
      },
      async (data) => {
        if (data.error) {
          console.error(data.error);
          return;
        }
        //const transport = this.device.createSendTransport(data);
        if (this.sendProduceTransport == null)
          this.sendProduceTransport = this.device.createSendTransport(data);
        this.sendProduceTransport.on(
          'connect',
          async ({ dtlsParameters }, callback, errback) => {
            this.socket.emit(
              'connectProducerTransport',
              { dtlsParameters },
              async (data) => callback
            );
          }
        );

        this.sendProduceTransport.on(
          'produce',
          async ({ kind, rtpParameters }, callback, errback) => {
            try {
              this.socket.emit(
                'produce',
                {
                  transportId: this.sendProduceTransport.id,
                  kind,
                  rtpParameters,
                },
                async ({ id }) => {
                  callback({ id });
                }
              );
            } catch (err) {
              errback(err);
            }
          }
        );

        this.sendProduceTransport.on('connectionstatechange', (state) => {
          switch (state) {
            case 'connecting':
              break;

            case 'connected':
              //video.nativeElement.srcObject = stream;
              break;

            case 'failed':
              this.sendProduceTransport.close();
              break;

            default:
              break;
          }
        });

        let stream;
        try {
          stream = await this.getUserMedia(this.sendProduceTransport);
          const track = stream.getVideoTracks()[0];
          const params = { track };
          this.producer = await this.sendProduceTransport.produce(params);
        } catch (err) { }
      }
    );
  }

  /**
   * asks for user video and audio
   * @param transport 
   */
  async getUserMedia(video = true) {
    if (!this.device.canProduce('video')) {
      console.error('cannot produce video');
      return;
    }

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: video,
        audio: true,
      });
    } catch (err) {
      console.error('getUserMedia() failed:', err.message);
      throw err;
    }
    return stream;
  }

  async subscribe(video) {
    this.socket.emit(
      'createConsumerTransport',
      {
        forceTcp: false,
      },
      async (data) => {
        if (data.error) {
          console.error(data.error);
          return;
        }

        //const transport = this.device.createRecvTransport(data);
        if (this.recvConsumeTransport == null)
          this.recvConsumeTransport.on('connect', ({ dtlsParameters }, callback, errback) => {
            this.socket.emit(
              'connectConsumerTransport',
              {
                transportId: this.recvConsumeTransport.id,
                dtlsParameters,
              },
              async (data) => callback
            );
          });

        this.recvConsumeTransport.on('connectionstatechange', async (state) => {
          switch (state) {
            case 'connecting':
              break;

            case 'connected':
              //video.nativeElement.srcObject = await stream;
              await this.socket.emit('resume');
              break;

            case 'failed':
              this.recvConsumeTransport.close();
              break;

            default:
              break;
          }
        });

        const stream = this.consume();
      }
    );
  }

  /**
   * Instructs the transport to receive an audio or video track to the mediasoup router
   * @param transport 
   */
  //async consume(transport) {
  async consume() {
    const { rtpCapabilities } = this.device;
    this.socket.emit('consume', { rtpCapabilities }, async (data) => {
      const { producerId, id, kind, rtpParameters } = data;

      const codecOptions = {};
      const consumer = await this.recvConsumeTransport.consume({
        id,
        producerId,
        kind,
        rtpParameters,
        codecOptions,
      });
      const stream = new MediaStream();
      stream.addTrack(consumer.track);
      return stream;
    });
  }

  on(event, listener) {
    this.socket.on(event, listener);
  }
}
