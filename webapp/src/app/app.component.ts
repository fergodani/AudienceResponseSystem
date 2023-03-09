import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiAuthService } from './core/services/auth/api.auth.service';
import { User } from './core/models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
}
