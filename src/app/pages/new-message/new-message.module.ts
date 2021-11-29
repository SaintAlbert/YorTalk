import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { NewMessagePage } from './new-message';
import { NewMessagePageRoutingModule } from './new-message-routing.module';
import { PipesModule } from '../../pipes.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    NewMessagePageRoutingModule
  ],
  declarations: [NewMessagePage],
  //exports: [NewMessagePage],
})
export class NewMessagePageModule {}
