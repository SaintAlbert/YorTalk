import {NgModule} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {UsersPage} from './users';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    UsersPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  exports: [
    UsersPage
  ]
})
export class UsersPageModule {}
