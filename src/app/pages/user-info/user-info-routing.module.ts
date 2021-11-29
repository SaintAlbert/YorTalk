import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserInfoPage } from './user-info';

const routes: Routes = [
  {
    path: '',
    component: UserInfoPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserInfoPageRoutingModule {}
