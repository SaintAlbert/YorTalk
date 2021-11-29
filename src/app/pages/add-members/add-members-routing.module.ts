import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddMembersPage } from './add-members';

const routes: Routes = [
  {
    path: '',
    component: AddMembersPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddMembersPageRoutingModule {}
