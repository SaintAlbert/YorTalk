import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommentsPage} from './comments';

@NgModule({
  declarations: [
    CommentsPage,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    CommentsPage
  ]
})
export class CommentsPageModule {}
