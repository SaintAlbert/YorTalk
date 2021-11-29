import {NgModule} from '@angular/core';
import { IonicModule} from '@ionic/angular';
import {ReportedPostPage} from './reported-post';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportedPostPageRoutingModule } from './reported-post-routing.module';
import { PipesModule } from '../../pipes.module';

@NgModule({
  declarations: [
    ReportedPostPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    ReportedPostPageRoutingModule
  ],
  //exports: [
  //  ReportedPostPage
  //]
})
export class ReportedPostPageModule {}
