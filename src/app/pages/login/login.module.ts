import {NgModule} from '@angular/core';
import { IonicModule} from '@ionic/angular';
import { LoginPage } from './login';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule ,
    IonicModule,
  ],
  exports: [
    LoginPage
  ]
})
export class LoginPageModule {}
