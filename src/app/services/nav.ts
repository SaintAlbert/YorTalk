import { Injectable } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Events } from './events';

@Injectable()
export class Nav {
  data: any;

  constructor(public navCtrl: NavController, private modalCtrl: ModalController, private events:Events) {
    // ...
  }

  push(url: string, data: any = '') {
    this.data = data;

    this.navCtrl.navigateForward('/' + url);
  }

  pop(url) {
    this.navCtrl.navigateBack('/' + url);
  }

  popToRoot() {
    this.navCtrl.navigateBack('/' );
  }
  setRoot(url: string) {
    this.navCtrl.navigateRoot('/' + url);
  }

  get(key: string) {
    return this.data[key];
  }


  async openModal(modalComponent: any, data: any) {
    var modal = await this.modalCtrl.create({
      component: modalComponent,
      cssClass: 'my-custom-class',
      componentProps: data
    });

    modal.onWillDismiss().then((date) => {
      //console.log(date.data)
      if (date.data)
        this.events.publish("onWillDismiss", date.data)
    })
    return await modal.present();
  }

  closeModal() {
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss();
  }

}
