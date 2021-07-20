import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MessagePage } from './message';

//import { MessagesPageRoutingModule } from './messages-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
   // MessagesPageRoutingModule
  ],
  declarations: [MessagePage]
})
export class MessagePageModule {}
