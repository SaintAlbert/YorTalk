import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {AddPostPage} from './add-post';

@NgModule({
  declarations: [
    AddPostPage,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    AddPostPage
  ]
})
export class AddPostPageModule {}
