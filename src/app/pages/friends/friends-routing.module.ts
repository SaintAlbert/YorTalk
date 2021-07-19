import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FriendsPage } from './friends';

const routes: Routes = [
  {
    path: '',
    component: FriendsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FriendsPageRoutingModule {}
