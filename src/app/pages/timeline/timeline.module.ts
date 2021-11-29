import { CommonModule } from '@angular/common';
import {NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule} from '@ionic/angular';
import { PipesModule } from '../../pipes.module';
import {TimelinePage} from './timeline';
import { TimelinePageRoutingModule } from './timeline-routing.module';

@NgModule({
  declarations: [
    TimelinePage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    TimelinePageRoutingModule
  ],
  //exports: [
  //  TimelinePage
  //]
})
export class TimelinePageModule {}
