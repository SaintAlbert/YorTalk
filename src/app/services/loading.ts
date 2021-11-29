import {Injectable} from '@angular/core';
import {LoadingController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingProvider {
  // Loading Provider
  // This is the provider class for most of the loading spinners screens on the app.
  // Set your spinner/loading indicator type here
  // List of Spinners: https://ionicframework.com/docs/v2/api/components/spinner/Spinner/
  private spinner = {
    //spinner: 'circles'
    content: 'Please wait...'
  };
  private loading;
  constructor(public loadingController: LoadingController) {
  }

  //Show loading
  async show() {
    if (!this.loading) {
      this.loadingController.create({}).then((opt) => {
        this.loading = opt;
        this.loading.present();
      });
      //this.loading = 
      //this.loading = await this.loadingController.create();
      //this.loading.present();
    }
  }

  //Hide loading
  hide() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }
}
