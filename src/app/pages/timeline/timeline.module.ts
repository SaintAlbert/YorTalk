import {NgModule} from '@angular/core';
import { IonicModule} from '@ionic/angular';
import {TimelinePage} from './timeline';

@NgModule({
  declarations: [
    TimelinePage,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    TimelinePage
  ]
})
export class TimelinePageModule {}
