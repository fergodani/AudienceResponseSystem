import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Game, GameState } from '@app/core/models/game.model';
import { User } from '@app/core/models/user.model';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { ApiProfessorService } from '@app/core/services/professor/api.professor.service';
import { SocketioService } from '@app/core/socket/socketio.service';

@Component({
  selector: 'app-host-game',
  templateUrl: './host-game.component.html',
  styleUrls: ['./host-game.component.css']
})
export class HostGameComponent implements OnInit {

  constructor(
    private socketService: SocketioService,
    private authService: ApiAuthService,
    private route: ActivatedRoute,
    private apiProfessorService: ApiProfessorService
  ) {
  }
  game: Game = <Game>{};
  gameStateType = GameState;
  @Input() courseId: number = 0;

  ngOnInit() {
    this.socketService.game.subscribe( (game: Game) => {this.game = game;})
    this.socketService.setupHostSocketConnection();
  }



}
