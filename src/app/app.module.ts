import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { Camera } from "@ionic-native/camera";
import { GooglePlus } from "@ionic-native/google-plus";
import { Keyboard } from "@ionic-native/keyboard";
import { Toast } from "@ionic-native/toast";
import { GoogleMaps } from "@ionic-native/google-maps";
import { Geolocation } from "@ionic-native/geolocation";

// import { AngularFireModule, AuthMethods, AuthProviders } from 'angularfire2';
import { AngularFireModule } from "angularfire2";
import { AngularFireDatabaseModule } from "angularfire2/database";
import * as firebase from "firebase/app";
// import { GooglePlus } from '@ionic-native/google-plus';
import { NativeAudio } from "@ionic-native/native-audio";
import { AdMobFree } from "@ionic-native/admob-free";
import { SocialSharing } from "@ionic-native/social-sharing";
import { Contacts } from "@ionic-native/contacts";
import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers, Storage } from '@ionic/storage';
import { File } from "@ionic-native/file";
import { MediaCapture } from "@ionic-native/media-capture";
//import { CordovaMediaProvider, defaultAudioProviderFactory, IonicAudioModule, WebAudioProvider } from "ionic-audio";
import { InAppBrowser } from "@ionic-native/in-app-browser";

import { Badge } from "@ionic-native/badge";

import { Login } from "./login";

import { FriendPipe } from "./pipes/friend";
import { SearchPipe } from "./pipes/search";
import { ConversationPipe } from "./pipes/conversation";
import { DateFormatPipe } from "./pipes/date";
import { GroupPipe } from "./pipes/group";



import { VideoProvider } from "./services/video";
import { CountryCodeProvider } from './services/country-code';
import { LoginProvider } from './services/login';
import { LogoutProvider } from './services/logout';
import { LoadingProvider } from './services/loading';
import { AlertProvider } from './services/alert';
import { ImageProvider } from './services/image';
import { DataProvider } from './services/data';
import { FirebaseProvider } from './services/firebase';
import { Nav } from './services/nav';

//export function myCustomAudioProviderFactory() {
//  return window.hasOwnProperty("cordova")
//    ? new CordovaMediaProvider()
//    : new WebAudioProvider();
//}

firebase.initializeApp(Login.firebaseConfig);


@NgModule({
  declarations: [AppComponent, FriendPipe, SearchPipe, ConversationPipe, DateFormatPipe, GroupPipe],
  entryComponents: [],
  imports: [BrowserModule,
   // IonicAudioModule.forRoot(defaultAudioProviderFactory),
    IonicModule.forRoot({
      mode: "ios",
      scrollAssist: false,
    }),
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
    }),
    AngularFireModule.initializeApp(Login.firebaseConfig),
    AngularFireDatabaseModule,
    //IonicModule.forRoot(),
    AppRoutingModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    StatusBar,
    SplashScreen,
    InAppBrowser,
    Camera,
    MediaCapture,
    File,
    GooglePlus,
    Keyboard,
    Toast,
    CountryCodeProvider,
    GoogleMaps,
    Contacts,
    Geolocation,
    AdMobFree,
    Badge,
    SocialSharing,
    //{ provide: ErrorHandler, useClass: IonicErrorHandler },
    LoginProvider,
    LogoutProvider,
    LoadingProvider,
    AlertProvider,
    ImageProvider,
    Nav,
    DataProvider,
    FirebaseProvider,
    NativeAudio,
    VideoProvider
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
