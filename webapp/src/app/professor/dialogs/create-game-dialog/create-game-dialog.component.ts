import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Game, GameState, GameType, PointsType } from '@app/core/models/game.model';
import { ApiProfessorService } from '@app/core/services/professor/api.professor.service';
import { SocketioService } from '@app/core/socket/socketio.service';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';

@Component({
  selector: 'app-create-game-dialog',
  templateUrl: './create-game-dialog.component.html',
  styleUrls: ['./create-game-dialog.component.css']
})
export class CreateGameDialogComponent {

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<CreateGameDialogComponent>,
    private apiProfessorService: ApiProfessorService,
    private socketService: SocketioService,
    private authService: ApiAuthService,
    @Inject(MAT_DIALOG_DATA) public survey_id: number,
    @Inject(MAT_DIALOG_DATA) public course_id: number,
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
    const pointTypeString = this.createGameForm.value.pointType! as keyof typeof PointsType;
    const game = new Game(
      this.authService.userValue!.id,
      this.survey_id,
      GameType.online,
      GameState.created,
      PointsType[pointTypeString] ,
      this.createGameForm.value.areQuestionsVisible == 1 ? true : false,
    );
    this.apiProfessorService
      .createGame(game)
      .subscribe( game => {
        this.socketService.createGame(game, this.course_id);
      })
    this.dialogRef.close();
    this.router.navigate(["/game/host", this.course_id])
  }


}
