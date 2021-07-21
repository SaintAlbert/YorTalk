import {NgModule} from '@angular/core';
import { IonicModule} from '@ionic/angular';
import {ReportedPostPage} from './reported-post';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ReportedPostPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  exports: [
    ReportedPostPage
  ]
})
export class ReportedPostPageModule {}
