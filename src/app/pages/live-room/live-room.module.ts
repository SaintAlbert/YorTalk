import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { PipesModule } from '../../pipes.module';
import { LiveRoomPageRoutingModule } from './live-room-routing.module';
import { LiveRoomPage } from './live-room';
//import { DenominationPage } from '../../components/denomination/denomination';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    LiveRoomPageRoutingModule
  ],
  declarations: [LiveRoomPage],
  //exports: [MessagesPage]
})
export class LiveRoomPageModule {}
