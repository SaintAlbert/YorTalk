import {Component, Input} from '@angular/core';
import { Nav } from '../../services/nav';


@Component({
  selector: 'page-camera-modal',
  templateUrl: 'camera-modal.html',
  styleUrls: ['camera-modal.scss']
})
export class CameraModalPage {
  selectedFilter = '';
  selectedIndex = 0;
  result: HTMLElement;

  @Input() image: any = '';

  slideOpts = {
    slidesPerView: 3.5,
    spaceBetween: 5,
    slidesOffsetBefore: 20,
    freeMode: true
  };

  filterOptions = [
    { name: 'Normal', value: '' },
    { name: 'Sepia', value: 'sepia' },
    { name: 'Blue Monotone', value: 'blue_monotone' },
    { name: 'Violent Tomato', value: 'violent_tomato' },
    { name: 'Grey', value: 'greyscale' },
    { name: 'Brightness', value: 'brightness' },
    { name: 'Saturation', value: 'saturation' },
    { name: 'Contrast', value: 'contrast' },
    { name: 'Hue', value: 'hue' },
    { name: 'Cookie', value: 'cookie' },
    { name: 'Vintage', value: 'vintage' },
    { name: 'Koda', value: 'koda' },
    { name: 'Technicolor', value: 'technicolor' },
    { name: 'Polaroid', value: 'polaroid' },
    { name: 'Bgr', value: 'bgr' }
  ];

  constructor(public navCtrl: Nav) { }

  ngOnInit() {
    console.log(this.image)
  }

  filter(index) {
    this.selectedFilter = this.filterOptions[index].value;
    this.selectedIndex = index;
  }

  imageLoaded(e) {
    // Grab a reference to the canvas/image
    this.result = e.detail.result;
  }

  saveImage() {
    let base64 = '';
    if (!this.selectedFilter) {
      // Use the original image!
      base64 = this.image;
    } else {
      let canvas = this.result as HTMLCanvasElement;
      // export as dataUrl or Blob!
      base64 = canvas.toDataURL('image/jpeg', 1.0);
    }

    // Do whatever you want with the result, e.g. download on desktop
    this.downloadBase64File(base64);
  }

  // https://stackoverflow.com/questions/16996319/javascript-save-base64-string-as-file
  downloadBase64File(base64) {
    const linkSource = `${base64}`;
    const downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);

    downloadLink.href = linkSource;
    downloadLink.target = '_self';
    downloadLink.download = 'test.png';
    downloadLink.click();
  }



  //startCameraAbove() {
  //  CameraPreview.stopCamera().then(() => {
  //    this.isToBack = false;
  //    CameraPreview.startCamera({ x: 80, y: 450, width: 250, height: 300, toBack: false, previewDrag: true, tapPhoto: true });
  //  })
  //}

  //startCameraBelow() {
  //  CameraPreview.stopCamera().then(() => {
  //    this.isToBack = true;
  //    CameraPreview.startCamera({ x: 0, y: 50, width: window.screen.width, height: window.screen.height, camera: "front", tapPhoto: true, previewDrag: false, toBack: true });
  //  })
  //}


  //stopCamera() {
  //  CameraPreview.stopCamera();
  //}

  //takePicture() {
  //  CameraPreview.takePicture({
  //    width: 1280,
  //    height: 1280,
  //    quality: 85
  //  }).then((imageData) => {
  //    this.IMAGE_PATH = 'data:image/jpeg;base64,' + imageData;
  //  }, (err) => {
  //    console.log(err);
  //    this.IMAGE_PATH = 'assets/img/test.jpg';
  //  });
  //}

  //switchCamera() {
  //  CameraPreview.switchCamera();
  //}

  //show() {
  //  CameraPreview.show();
  //}

  //hide() {
  //  CameraPreview.hide();
  //}

  //changeColorEffect() {
  //  CameraPreview.setColorEffect(this.colorEffect);
  //}

  //changeFlashMode() {
  //  CameraPreview.setFlashMode(this.flashMode);
  //}

  //changeZoom() {
  //  CameraPreview.setZoom(this.setZoom);
  //}

  //showSupportedPictureSizes() {
  //  CameraPreview.getSupportedPictureSizes().then((sizes) => {
  //    console.log(sizes);
  //  }, (err) => {
  //    console.log(err);
  //  });
  //}



  close() {
    //this.navCtrl.pop();
    this.navCtrl.closeModal()
    this.navCtrl.openModal
  }

}
