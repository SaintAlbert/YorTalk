import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginPage } from './login';

const routes: Routes = [
  {
    path: '',
    component: LoginPage,
  },
  //{
  //  path: 'login',
  //  loadChildren: () => import('../login/login.module').then(m => m.LoginPageModule)
  //},
  {
    path: 'verification',
    loadChildren: () => import('../verification/verification.module').then(m => m.VerificationPageModule)
  },
  {
    path: 'trial',
    loadChildren: () => import('../trial/trial.module').then(m => m.TrialPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}
