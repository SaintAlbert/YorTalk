import {NgModule} from '@angular/core';
import { IonicModule} from '@ionic/angular';
import {ReportedPostPage} from './reported-post';

@NgModule({
  declarations: [
    ReportedPostPage,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    ReportedPostPage
  ]
})
export class ReportedPostPageModule {}
