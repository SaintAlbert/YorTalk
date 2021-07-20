import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AddMembersPage } from './add-members';

//import { MessagesPageRoutingModule } from './messages-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    //MessagesPageRoutingModule
  ],
  declarations: [AddMembersPage]
})
export class AddMembersPageModule {}
