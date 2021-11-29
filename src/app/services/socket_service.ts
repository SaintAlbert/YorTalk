import { Injectable } from '@angular/core';

import { Observable} from 'rxjs';

//export var WS_ENDPOINT="" //= environment.wsEndpoint;
import { io, Socket } from "socket.io-client";



@Injectable({
  providedIn: 'root'
})
export class DataSocketService {
  public WS_ENDPOINT = "";
  private socket: Socket;

  constructor() {
    //this.socket = this.connectToWebsocket();
  }

  connectToWebsocket() {
    //return io(this.WS_ENDPOINT);
    this.socket = io(this.WS_ENDPOINT);
  }

  getMessages() {
    let observable = new Observable(observer => {
      //this.socket = io(this.WS_ENDPOINT);
      this.socket.on('message', (data) => {
        observer.next({ type:'message', data:data });
      });
      return () => {
        this.socket.disconnect();
      };
    })
    return observable;
  }

  sendMessage(event, data) {
    try {
      console.log(event, data)
      this.socket.emit(event, data)
    } catch(e)  { console.log("Socket Error",e) }
  }
  close() {
    this.socket.close();
  }


  /*
const eventX$ = this.socket$.multiplex(
  () => ({subscribe: 'eventX'}),
  () => ({unsubscribe: 'eventX'}),
  message => message.type === 'eventX');

const subA = eventX$.subscribe(messageForAlerts => console.log(messageForAlerts));
*/

}
