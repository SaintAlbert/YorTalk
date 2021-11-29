import {Component} from '@angular/core';
import { Nav } from '../../services/nav';

@Component({
  selector: 'page-image-modal',
  templateUrl: 'image-modal.html',
  styleUrls: ['image-modal.scss']
})
export class ImageModalPage {
  // ImageModalPage
  // This is the page that pops up when the user tapped on an image on product view.
  // product.html.
  private image;
  constructor(public navCtrl: Nav) { }

  ngOnInit () {
    this.image = this.navCtrl.get('img');
  }

  close() {
    //this.navCtrl.pop();
    this.navCtrl.closeModal()
  }

}
