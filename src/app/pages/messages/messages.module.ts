import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MessagesPage } from './messages';
import { MessagesPageRoutingModule } from './messages-routing.module';
import { PipesModule } from '../../pipes.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    MessagesPageRoutingModule
  ],
  declarations: [MessagesPage],
  //exports: [MessagesPage]
})
export class MessagesPageModule {}
