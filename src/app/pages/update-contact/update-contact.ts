import {Component, NgZone} from '@angular/core';
import {NavParams, Platform, ViewController} from '@ionic/angular';
import {CountryCodeProvider} from '../../services/country-code';
import {AngularFireDatabase} from 'angularfire2/database';
import {AlertProvider} from '../../services/alert';
import {LoadingProvider} from '../../services/loading';

import {DataProvider} from '../../services/data';

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
	    public params: NavParams,
	    public loadingProvider: LoadingProvider,
	    public viewCtrl: ViewController,
	    public dataProvider: DataProvider,
	    public alertProvider: AlertProvider,
        public angularDb:AngularFireDatabase,
		public countryCodeProvider: CountryCodeProvider){
		 this.zone.run(() => {
			this.dataProvider.getData('userData').then((data)=>{
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
	    this.viewCtrl.dismiss();
	}

	updateContact(){
		if(this.countryCode != undefined && this.phoneNumber){
			this.loadingProvider.show();

			let phoneNumber = this.countryCode+this.phoneNumber;
			this.dataProvider.getUserWithPhonenumber(phoneNumber).take(1).subscribe((userList) => {

			this.loadingProvider.hide();
	        if (userList.length > 0) {
	           this.alertProvider.showErrorMessage('profile/error-same-phoneNumber');
	        } else {
	          this.angularDb.object('/accounts/' + this.user.userId).update({
	          	countryCode: this.countryCode,
	            phoneNumber: phoneNumber
	          }).then((success) => {
	            this.alertProvider.showPhoneNumberUpdatedMessage();
	            this.viewCtrl.dismiss();
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
