import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {AddPostPage} from './add-post';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AddPostPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  exports: [
    AddPostPage
  ]
})
export class AddPostPageModule {}
