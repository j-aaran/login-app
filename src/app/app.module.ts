import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AuthService } from './core/auth/auth.service';
import { UserService } from './core/user/user.service';
import { UserApi } from './mock/api-user.service';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
  ],
  providers: [AuthService, UserService, UserApi],
  //bootstrap: [AppComponent]
})
export class AppModule { }
