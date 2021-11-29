import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { VideoCallPage } from './components/video-call/video-call';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';
//Pages
//import { LoginPage } from './pages/login/login';
//import { TabsPage } from './pages/tabs/tabs';
import { DataProvider } from './services/data';
import { VideoProvider } from './services/video';
import { Events } from './services/events';
import { Nav } from './services/nav';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';
import { DataSocketService } from './services/socket_service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  //rootPage: any;
  httpServerURL = "http://127.0.0.1:8001";
  public SocketInstance: DataSocketService;
  userData: any;
  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    keyboard: Keyboard,
    public events: Events,
    private admobFree: AdMobFree,
    public videoProvider: VideoProvider,
    public angularDb: AngularFireDatabase,
    public dataProvider: DataProvider,
    public navCtrl: Nav,
    private socket: DataSocketService  ) {
    platform.ready().then(() => {

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.events.subscribe('openVideocall', async () => {
        this.navCtrl.openModal(VideoCallPage,null );
        //let profileModal = await this.modalCtrl.create({ component: VideoCallPage });
        //profileModal.present();
      })

      //firebase.auth().onAuthStateChanged((data) => {
      //  //alert(JSON.stringify( user))
      //  let userData = <any>data;
      //  this.userData = userData

      //  if (userData) {
      //    console.log(userData)
      //    let _userData = <any>userData;

      //    this.angularDb.object('/accounts/' + _userData.userId).update({
      //      isOnline: true
      //    }).then((success) => {

      //    }).catch((error) => {
      //      console.log(error)
      //      //this.alertProvider.showErrorMessage('profile/error-update-profile');
      //    });
      //    // if(_userData.phoneNumber == '' || !_userData.phoneNumber){
      //    //     let profileModal = this.modalCtrl.create(UpdateContactPage,{userData:_userData});
      //    //     profileModal.present();
      //    // }
      //    // this.dataProvider.getContact().then(data=>{
      //    //   if(data && this.userData.phoneNumber!=''){
      //    //       this.dataProvider.setContactWithCountryCode(this.userData.countryCode)
      //    //   }
      //    // });
      //    this.videoProvider.InitializingRTC(_userData);
      //   // this.navCtrl.setRoot('tabs');
      //  } else {
      //    // this.dataProvider.getContact().then(data=>{
      //    //   if(data && this.userData!=''){
      //    //       this.dataProvider.setContactWithCountryCode(this.userData.countryCode)
      //    //   }
      //    // });
      //    //this.rootPage = LoginPage
      //    //alert("Ready")
      //   // this.navCtrl.setRoot('login');
      //  }

      //})

      //this.dataProvider.getData('userData').then((data) => {

      //  let userData = <any>data;
      //  this.userData = userData.value;
      //  if (userData.value) {
      //    console.log(userData.value)
      //    let _userData = <any>userData.value;
      //    //this.rootPage = TabsPage;
      //    //
      //    this.angularDb.object('/accounts/' + _userData.userId).update({
      //      isOnline: true
      //    }).then((success) => {

      //    }).catch((error) => {
      //      console.log(error)
      //      //this.alertProvider.showErrorMessage('profile/error-update-profile');
      //    });
      //    // if(_userData.phoneNumber == '' || !_userData.phoneNumber){
      //    //     let profileModal = this.modalCtrl.create(UpdateContactPage,{userData:_userData});
      //    //     profileModal.present();
      //    // }
      //    // this.dataProvider.getContact().then(data=>{
      //    //   if(data && this.userData.phoneNumber!=''){
      //    //       this.dataProvider.setContactWithCountryCode(this.userData.countryCode)
      //    //   }
      //    // });
      //    this.videoProvider.InitializingRTC(_userData);
      //    this.navCtrl.setRoot('tabs');
      //  } else {
      //    // this.dataProvider.getContact().then(data=>{
      //    //   if(data && this.userData!=''){
      //    //       this.dataProvider.setContactWithCountryCode(this.userData.countryCode)
      //    //   }
      //    // });
      //    //this.rootPage = LoginPage
      //    //alert("Ready")
      //    this.navCtrl.setRoot('login');
      //  }

      //})


      // const bannerConfig: AdMobFreeBannerConfig = {
      //  // add your config here
      //  // for the sake of this example we will just use the test config
      //  id:'ca-app-pub-8355081094607232~7474863280',
      //  isTesting: true,
      //  autoShow: true,
      //  overlap:false
      // };
      // this.admobFree.banner.config(bannerConfig);

      // this.admobFree.banner.prepare()
      //   .then(() => {
      //     // banner Ad is ready
      //     // if we set autoShow to false, then we will need to call the show method here
      //   })
      //   .catch(e => console.log(e));

      //   keyboard.hideKeyboardAccessoryBar(false);
    });
  }

  ngOnInit() {
    firebase.auth().onAuthStateChanged((data) => {
      //alert(JSON.stringify( user))
      let userData = <any>data;
      this.userData = userData

      if (userData) {
        console.log(userData)
        let _userData = <any>userData;

        this.angularDb.object('/accounts/' + _userData.userId).update({
          isOnline: true
        }).then((success) => {

        }).catch((error) => {
          console.log(error)
          //this.alertProvider.showErrorMessage('profile/error-update-profile');
        });
        // if(_userData.phoneNumber == '' || !_userData.phoneNumber){
        //     let profileModal = this.modalCtrl.create(UpdateContactPage,{userData:_userData});
        //     profileModal.present();
        // }
        // this.dataProvider.getContact().then(data=>{
        //   if(data && this.userData.phoneNumber!=''){
        //       this.dataProvider.setContactWithCountryCode(this.userData.countryCode)
        //   }
        // });
        this.socket.WS_ENDPOINT = this.httpServerURL;
        this.socket.connectToWebsocket();
        this.SocketInstance = this.socket;
        this.videoProvider.InitializingRTC(_userData);
        this.navCtrl.setRoot('tabs');
      } else {
        // this.dataProvider.getContact().then(data=>{
        //   if(data && this.userData!=''){
        //       this.dataProvider.setContactWithCountryCode(this.userData.countryCode)
        //   }
        // });
        //this.rootPage = LoginPage
        //alert("Ready")
        this.navCtrl.setRoot('login');
      }

    })
  }

}
