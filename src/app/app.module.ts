import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
//import { IonicStorageModule } from '@ionic/storage-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule, HttpHeaders, HttpParams, HTTP_INTERCEPTORS } from '@angular/common/http';
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

import { AngularFireModule } from "angularfire2";
import { AngularFireDatabaseModule } from "angularfire2/database";

import  firebase from "firebase/app";
// import { GooglePlus } from '@ionic-native/google-plus';
import { NativeAudio } from "@ionic-native/native-audio";
import { AdMobFree } from "@ionic-native/admob-free";
import { SocialSharing } from "@ionic-native/social-sharing";
import { Contacts } from "@ionic-native/contacts";
import { Storage } from '@ionic/storage';

import { File } from "@ionic-native/file";
import { MediaCapture } from "@ionic-native/media-capture";
//import { CordovaMediaProvider, defaultAudioProviderFactory, IonicAudioModule, WebAudioProvider } from "ionic-audio";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { Badge } from "@ionic-native/badge";
import { Login } from "./login";


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
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
//import { IonicConfig} from '@ionic/core';
import { PipesModule } from './pipes.module';
import { APP_BASE_HREF } from '@angular/common';
import { components } from './components/components.import';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { NgxImageCompressService } from 'ngx-image-compress';
import '@ionic/pwa-elements';
//import { SocketioService } from './services/socketio.service';
import { ApiHttpService, Constants } from './services/ApiHttpService';
import { BasicAuthInterceptor } from './services/BasicAuthInterceptor ';
import { DataSocketService } from './services/socket_service';
firebase.initializeApp(Login.firebaseConfig);

//import "websocket-polyfill";

@NgModule({
  declarations: [AppComponent, ...components],
  entryComponents: [...components],
  imports: [BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    // IonicAudioModule.forRoot(defaultAudioProviderFactory),
    IonicModule.forRoot({
      mode: "ios",
    }),
    AppRoutingModule,
    AngularFireModule.initializeApp(Login.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    //SharedModule,
    PipesModule
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
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
    Storage,
    //{ provide: ErrorHandler, useClass: IonicErrorHandler },
    LoginProvider,
    LogoutProvider,
    LoadingProvider,
    AlertProvider,
    ImageProvider,
    Nav,
    DataProvider,
    FirebaseProvider,
    DataSocketService,
    NativeAudio,
    VideoProvider,
    //SocketioService,
    NgxImageCompressService,
    ApiHttpService,
    Constants
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
