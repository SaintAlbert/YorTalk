import {NgModule} from '@angular/core';
import { IonicModule} from '@ionic/angular';
import { LoginPage } from './login';

@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    LoginPage
  ]
})
export class LoginPageModule {}
