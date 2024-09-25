import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { FormGroup, FormBuilder, Validators,ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';

import { AuthService } from './core/auth/auth.service';
import { UserService } from './core/user/user.service';
import { UserApi } from './mock/api-user.service';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [AuthService, UserService, UserApi],
  //bootstrap: [AppComponent]
})
export class AppModule { }
