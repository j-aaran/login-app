import { Component } from '@angular/core';
import { UserService } from '../core/user/user.service';
import { User } from '../core/user/user.types';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  
  user: User;

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _authService: AuthService,
  ) {}

  ngOnInit() {
    this._userService.user$.subscribe((user: User) => {
      this.user = user;
    })
  }

  // ------------------------------------------------------
  // @ Métodos públicos
  // ------------------------------------------------------
  blockUser() {
    this._router.navigateByUrl('/unlock-session');
  }

  signOut(){
    this._authService.isAuthenticated = false
    this._router.navigateByUrl('/sign-in');
  }
}
