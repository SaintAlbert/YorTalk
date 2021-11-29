import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewMessagePage } from './new-message';

const routes: Routes = [
  {
    path: '',
    component: NewMessagePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewMessagePageRoutingModule {}
