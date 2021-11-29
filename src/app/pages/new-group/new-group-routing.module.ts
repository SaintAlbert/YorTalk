import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewGroupPage } from './new-group';

const routes: Routes = [
  {
    path: '',
    component: NewGroupPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewGroupPageRoutingModule {}
