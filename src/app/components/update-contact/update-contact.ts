import {Component, NgZone} from '@angular/core';
import {Platform} from '@ionic/angular';
import {CountryCodeProvider} from '../../services/country-code';
import {AlertProvider} from '../../services/alert';
import {LoadingProvider} from '../../services/loading';

import {DataProvider} from '../../services/data';
import { Nav } from '../../services/nav';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'page-update-contact',
  templateUrl: 'update-contact.html',
  styleUrls: ['update-contact.scss']
})

export class UpdateContactPage {
	countryCode = '';
	phoneNumber :any;
	countryList = [];
	user;
	constructor(
	    public zone: NgZone,
		public platform: Platform,
	    public loadingProvider: LoadingProvider,
	    public viewCtrl: Nav,
	    public dataProvider: DataProvider,
	    public alertProvider: AlertProvider,
        public angularDb:AngularFireDatabase,
		public countryCodeProvider: CountryCodeProvider){
		 this.zone.run(() => {
			this.dataProvider.getData('userData').then((data:any)=>{
				this.user = data;
				if(this.countryCode != undefined){
					this.phoneNumber = parseInt(data.phoneNumber.replace(this.countryCode,''))
				}else{
					this.phoneNumber = parseInt(data.phoneNumber)
				}
	        })
   			this.countryList = this.countryCodeProvider.getCountryCode();
		})
	}

	dismiss() {
	    this.viewCtrl.closeModal();
	}

	updateContact(){
		if(this.countryCode != undefined && this.phoneNumber){
			this.loadingProvider.show();

      let phoneNumber = this.countryCode + this.phoneNumber;
      this.dataProvider.getUserWithPhonenumber(phoneNumber).subscribe((userList) => {

			this.loadingProvider.hide();
	        if (userList.length > 0) {
	           this.alertProvider.showErrorMessage('profile/error-same-phoneNumber');
	        } else {
	          this.angularDb.object('/accounts/' + this.user.userId).update({
	          	countryCode: this.countryCode,
	            phoneNumber: phoneNumber
	          }).then((success) => {
	            this.alertProvider.showPhoneNumberUpdatedMessage();
	            this.viewCtrl.closeModal();
	          }).catch((error) => {
	            this.alertProvider.showErrorMessage('profile/error-update-profile');
	          });
	        }
	      });
		}else if(this.countryCode != undefined){
			this.alertProvider.showAlert("Failed", "Please choose your country");
		}else if(this.phoneNumber != undefined){
			this.alertProvider.showAlert("Failed", "Please choose your phoneNumber");
		}
	}
}
