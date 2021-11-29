import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MessagePage } from './message';
import { MessagePageRoutingModule } from './message-routing.module';
import { PipesModule } from '../../pipes.module';

//import { MessagesPageRoutingModule } from './messages-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    MessagePageRoutingModule
  ],
  declarations: [MessagePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
 // exports: [MessagePage],
})
export class MessagePageModule {}
