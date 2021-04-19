import {  VerifyAccountComponent } from './verify-account/verify-account.component';
import { RegistrationComponent } from './registration/registration.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { LoginComponent } from './login/login.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'prisijungti', component: LoginComponent},
  {path: 'registruotis', component: RegistrationComponent},
  {path: 'verify/:token', component: VerifyAccountComponent}
];

export const NonAuthRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
