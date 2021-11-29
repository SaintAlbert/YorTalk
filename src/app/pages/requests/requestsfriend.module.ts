import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RequestsPage } from './requestsfriend';
import { RequestsPageRoutingModule } from './requestsfriend-routing.module';
import { PipesModule } from '../../pipes.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    RequestsPageRoutingModule
  ],
  declarations: [RequestsPage],
  //exports: [RequestsPage],
})
export class RequestsFriendPageModule {}
