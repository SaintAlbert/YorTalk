import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { NewGroupPage } from './new-group';
import { NewGroupPageRoutingModule } from './new-group-routing.module';
import { PipesModule } from '../../pipes.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    NewGroupPageRoutingModule
  ],
  declarations: [NewGroupPage],
  //exports: [NewGroupPage],
})
export class NewGroupPageModule {}
