
import {NgModule} from '@angular/core';
import { IonicModule} from '@ionic/angular';
import { LoginPage } from './login';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { LoginPageRoutingModule } from './login-routing.module';
import { PipesModule } from '../../pipes.module';

@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PipesModule,
    LoginPageRoutingModule
  ],
  //exports: [
  //  LoginPage
  //]
})
export class LoginPageModule {}
