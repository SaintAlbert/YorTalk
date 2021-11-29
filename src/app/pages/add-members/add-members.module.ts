import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AddMembersPage } from './add-members';
import { AddMembersPageRoutingModule } from './add-members-routing.module';
import { PipesModule } from '../../pipes.module';

//import { MessagesPageRoutingModule } from './messages-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    AddMembersPageRoutingModule
  ],
  declarations: [AddMembersPage],
  //exports: [
  //  AddMembersPage
  //]
})
export class AddMembersPageModule {}
