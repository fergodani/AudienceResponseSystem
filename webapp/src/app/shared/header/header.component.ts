import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/core/models/user.model';
import { ApiAuthService } from 'src/app/core/services/auth/api.auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  user: User | null = <User | null>{};
  isMenuCollapsed = true;

  constructor(private authService: ApiAuthService) {
    this.authService.user.subscribe(user => this.user = user)
  }

  get isAdmin() {
    return this.user && this.user.role === 'admin';
  }

  get isProfessor() {
    return this.user && this.user.role === 'professor';
  }

  get isStudent() {
    return this.user && this.user.role === 'student';
  }

  logout() {
    this.authService.logout();
    this.isMenuCollapsed = true;
  }

}
