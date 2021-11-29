import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiveRoomPage } from './live-room';


const routes: Routes = [
  {
    path: '',
    component: LiveRoomPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiveRoomPageRoutingModule {}
