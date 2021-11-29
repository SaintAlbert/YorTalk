import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { UserInfoPage } from './user-info';
import { UserInfoPageRoutingModule } from './user-info-routing.module';
import { PipesModule } from '../../pipes.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    UserInfoPageRoutingModule
  ],
  declarations: [UserInfoPage],
  exports: [UserInfoPage],
})
export class UserInfoPageModule {}
