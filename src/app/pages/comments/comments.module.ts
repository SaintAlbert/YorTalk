import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommentsPage} from './comments';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CommentsPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  exports: [
    CommentsPage
  ]
})
export class CommentsPageModule {}
