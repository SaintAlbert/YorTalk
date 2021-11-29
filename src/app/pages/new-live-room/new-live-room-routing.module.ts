import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewLiveRoomPage } from './new-live-room';


const routes: Routes = [
  {
    path: '',
    component: NewLiveRoomPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewLiveRoomPageRoutingModule {}
