import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportedPostPage } from './reported-post';

const routes: Routes = [
  {
    path: '',
    component: ReportedPostPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportedPostPageRoutingModule {}
