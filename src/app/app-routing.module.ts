import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ConfirmationRequiredComponent } from './auth/confirmation-required/confirmation-required.component';
import { NewPasswordComponent } from './auth/new-password/new-password.component';
import { UnlockSessionComponent } from './auth/unlock-session/unlock-session.component';

export const routes: Routes = [
  {path: '', redirectTo: 'sign-in', pathMatch: 'full'},
  {path: 'sign-in', component: SignInComponent},
  {path: 'sign-up', component: SignUpComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'confirmation-required', component: ConfirmationRequiredComponent},
  {path: 'new-password', component: NewPasswordComponent},
  {path: 'unlock-session', component: UnlockSessionComponent},
  {path: 'home', component: HomeComponent},
];

/*
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
*/