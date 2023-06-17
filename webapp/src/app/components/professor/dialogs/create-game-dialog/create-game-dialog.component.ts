import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
    @Inject(MAT_DIALOG_DATA) public data: Data,
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
    areQuestionsVisible: new FormControl(false, [
      Validators.required
    ])
  })
  isLoading = false

  onNoClick() {
    this.dialogRef.close();
  }

  onCreateGame() {
    if (this.createGameForm.invalid) {
      return;
    }
    const pointType = this.getPointType(this.createGameForm.value.pointType!);
    const game = new Game(
      this.authService.userValue!.id,
      this.data.survey_id,
      GameType.online,
      GameState.created,
      pointType,
      this.createGameForm.value.areQuestionsVisible!,
      this.data.course_id
    );
    this.isLoading = true
    this.apiProfessorService
      .createGame(game)
      .subscribe(game => {
        (async () => {
          //this.socketService.setupSocketConnection()
          this.isLoading = false
          this.dialogRef.close();
          await this.router.navigate(["/course", this.data.course_id, 'game', game.id])
        })()
      })

  }

  getPointType(type: string): PointsType {
    switch (type) {
      case 'Estándar': {
        return PointsType.standard;
      }
      case 'Doble': {
        return PointsType.double
      }
      case 'Sin puntuación': {
        return PointsType.no_points
      }
      default: {
        return PointsType.standard
      }
    }
  }

}

interface Data {
  course_id: number;
  survey_id: number;
}
