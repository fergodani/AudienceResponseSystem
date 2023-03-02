import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/core/models/user.model';
import { ApiService } from 'src/app/core/services/api.admin.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  constructor(private apiService: ApiService, private router: Router) { }

  users: User[] = []



  ngOnInit(): void {

    this.apiService
      .getUsers()
      .subscribe(users => this.apiService.users = this.users = users)
  }

  onCreateUser() {
    this.router.navigate(["/users/create"])
  }

  onDeleteUser(id: number) {
    this.users = this.users.filter( user =>  user.id != id)
    this.apiService
    .deleteUser(id)
    .subscribe()
  }

}
