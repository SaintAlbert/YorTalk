import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '../../pipes.module';
import { NewLiveRoomPage } from './new-live-room';
import { NewLiveRoomPageRoutingModule } from './new-live-room-routing.module';
import { DenominationPage } from '../../components/denomination/denomination';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    NewLiveRoomPageRoutingModule
  ],
  declarations: [NewLiveRoomPage, DenominationPage],
  //exports: [NewMessagePage],
})
export class NewLiveRoomPageeModule {}
