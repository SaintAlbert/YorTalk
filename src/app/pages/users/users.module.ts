import {NgModule} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {UsersPage} from './users';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersPageRoutingModule } from './user-routing.module';
import { PipesModule } from '../../pipes.module';

@NgModule({
  declarations: [
    UsersPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    UsersPageRoutingModule
  ],
  //exports: [
  //  UsersPage
  //]
})
export class UsersPageModule {}
