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
  fileName: string = ''
  requiredFileType = "text/csv";

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

  onFileSelected(event: Event) {
    const file = (<HTMLInputElement>event.target).files![0];

    // TODO: comprobar de otra manera, si file es null daria error esto creo
    if (file && file.type == this.requiredFileType) {
      this.fileName = file.name;
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);
      console.log(formData.get('file'))
      this.apiService
      .uploadUserFile(formData)
      .subscribe(msg => alert("Archivo subido correctamente"))
    }
  }

}
