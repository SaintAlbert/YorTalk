import {NgModule} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {UsersPage} from './users';

@NgModule({
  declarations: [
    UsersPage,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    UsersPage
  ]
})
export class UsersPageModule {}
