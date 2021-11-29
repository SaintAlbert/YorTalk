import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TrialPage } from './trial';

const routes: Routes = [
  {
    path: '',
    component: TrialPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrialPageRoutingModule {}
