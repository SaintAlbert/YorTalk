import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { GroupPage } from './group';
import { GroupPageRoutingModule } from './group-routing.module';
import { PipesModule } from '../../pipes.module';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    GroupPageRoutingModule
  ],
  declarations: [GroupPage],
 // exports: [GroupPage]
})
export class GroupPageModule {}
