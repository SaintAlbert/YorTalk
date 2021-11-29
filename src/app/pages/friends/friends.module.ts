import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { FriendsPage } from './friends';

import { FriendsPageRoutingModule } from './friends-routing.module';
import { PipesModule } from '../../pipes.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    FriendsPageRoutingModule,
  ],
  declarations: [FriendsPage],
  //exports: [FriendsPage]
})
export class FriendsPageModule {}
