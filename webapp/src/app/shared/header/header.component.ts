import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/core/models/user.model';
import { ApiAuthService } from 'src/app/core/services/auth/api.auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnChanges {

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)

  }
  constructor(private authService: ApiAuthService){}

  userLogged: User = this.authService.userLogged;

  ngOnInit(): void {
    this.userLogged = this.authService.userLogged;
    console.log(this.userLogged)
  }

}
