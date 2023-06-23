import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from '@app/core/models/message.model';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { equals, User } from 'src/app/core/models/user.model';
import { ApiService } from 'src/app/core/services/admin/api.admin.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  constructor(
    private apiService: ApiService, 
    private router: Router,
    private authService: ApiAuthService) {
      this.authService.user.subscribe(user => this.user = user)
     }

  users: User[] = []
  fileName: string = ''
  requiredFileType = "text/csv";
  isLoading: boolean = true;
  user: User | null = <User | null>{};

  @Input() isSelecting: boolean = false;
  @Input() usersAdded: User[] = [];
  @Output() userToAdd = new EventEmitter<User>;
  

  ngOnInit(): void {
    this.apiService
      .getUsers()
      .subscribe(users => {this.apiService.users = this.users = users; this.isLoading = false})
  }

  async onCreateUser() {
    await this.router.navigate(["/users/create"])
  }

  onDeleteUser(id: number) {
    this.users = this.users.filter( user =>  user.id != id)
    this.apiService
    .deleteUser(id)
    .subscribe((msg: Message) => {alert(msg.message)})
  }

  onFileSelected(event: Event) {
    const file = (<HTMLInputElement>event.target).files![0];
    console.log(file.type)
    if (file && file.type == this.requiredFileType) {
      this.fileName = file.name;
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);
      this.apiService
      .uploadUserFile(formData)
      .subscribe((msg: Message) => alert(msg.message))
    }
  }

  get isAdmin() {
    return this.user && this.user.role === 'admin';
  }

  get isProfessor() {
    return this.user && this.user.role === 'professor';
  }

  addUserToCourse(user: User) {
    this.userToAdd.emit(user);
    this.usersAdded.push(user);
  }

  isInclude(user: User){
    let value = false
    this.usersAdded.forEach( userToCompare => {
      if(equals(user, userToCompare))
        value = true;
    })
    return value;
  }


}
