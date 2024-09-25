import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { LinksComponent } from './components/links/links.component';

import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    NavbarComponent, 
    FooterComponent, 
    LinksComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'login-app';

  isAuthenticated: boolean = false;

  constructor(private _authService: AuthService) {}

  ngOnInit() {
    this._authService.isAuthenticated$.subscribe((value) => {
      this.isAuthenticated = value
    })
  }
}
