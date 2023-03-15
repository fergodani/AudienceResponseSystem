import { Component, Inject } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { User } from '@app/core/models/user.model';

@Component({
  selector: 'app-link-user-course',
  templateUrl: './link-user-course.component.html',
  styleUrls: ['./link-user-course.component.css']
})
export class LinkUserCourseComponent {

  constructor(
    public dialogRef: MatDialogRef<LinkUserCourseComponent>,
    @Inject(MAT_DIALOG_DATA) public usersAdded: User[],
  ) {
  }

  users: User[] = [];

  onNoClick(): void {
    this.dialogRef.close();
  }

  addUser(user: User) {
    if(!this.users.includes(user)){
      this.users.push(user)
    }
  }
}
