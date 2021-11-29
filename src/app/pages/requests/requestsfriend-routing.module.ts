import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestsPage } from './requestsfriend';

const routes: Routes = [
  {
    path: '',
    component: RequestsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestsPageRoutingModule {}
