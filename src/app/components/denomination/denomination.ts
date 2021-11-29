import {Component, EventEmitter, Output} from '@angular/core';
import { Nav } from '../../services/nav';

@Component({
  selector: 'page-denomination',
  templateUrl: 'denomination.html',
  styleUrls: ['denomination.scss']
})
export class DenominationPage {
  // ImageModalPage
  // This is the page that pops up when the user tapped on an image on product view.
  // product.html.
  //private image;
  @Output() dollarEvent = new EventEmitter<any>();
  constructor(public navCtrl: Nav) { }

  ngOnInit () {
    //this.image = this.navCtrl.get('img');
  }

  close() {
    //this.navCtrl.pop();
    this.navCtrl.closeModal()
  }

  giveDollar(n) {
    this.dollarEvent.emit(n);
  }

}
