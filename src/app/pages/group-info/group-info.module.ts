import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { GroupInfoPage } from './group-info';
import { GroupInfoPageRoutingModule } from './group-info-routing.module';
import { PipesModule } from '../../pipes.module';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    GroupInfoPageRoutingModule
  ],
  declarations: [GroupInfoPage],
  //exports: [GroupInfoPage]
})
export class GroupInfoPageModule {}
