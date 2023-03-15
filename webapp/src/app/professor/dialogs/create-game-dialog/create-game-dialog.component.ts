import { Component } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-game-dialog',
  templateUrl: './create-game-dialog.component.html',
  styleUrls: ['./create-game-dialog.component.css']
})
export class CreateGameDialogComponent {

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<CreateGameDialogComponent>
  ) {
  }

  point_types = [
    'Estándar',
    'Doble',
    'Sin puntuación'
  ]

  createGameForm = new FormGroup({
    pointType: new FormControl('', [
      Validators.required
    ]),
    areQuestionsVisible: new FormControl(0, [
      Validators.required
    ])
  })

  onNoClick() {
    this.dialogRef.close();
  }

  onCreateGame() {
    if (this.createGameForm.invalid) {
      return;
    }
    this.dialogRef.close();
    this.router.navigate(["/game/host/1"],
    { queryParams: {point_type: this.createGameForm.value.pointType, show_question: this.createGameForm.value.areQuestionsVisible}})
  }

}
