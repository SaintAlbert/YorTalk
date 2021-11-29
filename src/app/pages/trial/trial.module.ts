import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TrialPage } from './trial';
import { PipesModule } from '../../pipes.module';

//import { FriendsPageRoutingModule } from './friends-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
   // FriendsPageRoutingModule
  ],
  declarations: [TrialPage],
 // exports: [TrialPage],
})
export class TrialPageModule {}
