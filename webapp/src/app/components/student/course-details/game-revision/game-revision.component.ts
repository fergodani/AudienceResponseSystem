import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserResult } from '@app/core/models/user.model';
import { ApiStudentService } from '@app/core/services/user/api.user.service';

@Component({
  selector: 'app-game-revision',
  templateUrl: './game-revision.component.html',
  styleUrls: ['./game-revision.component.css']
})
export class GameRevisionComponent implements OnInit{

  constructor(
    private apiStudentService: ApiStudentService,
    private actRoute: ActivatedRoute
  ) {
    
  }
  ngOnInit(): void {
    this.isLoading = true
    const game_id = this.actRoute.snapshot.paramMap.get('game_id');
    const user_id = this.actRoute.snapshot.paramMap.get('user_id');
    this.apiStudentService
    .getGamesResultByUserAndGame(Number(user_id), Number(game_id))
    .subscribe(result => {
      this.result = result; this.isLoading = false; 
      console.log(this.result)
      this.questionIndexes = Array(this.result.game?.survey?.questionsSurvey.length).fill(1).map((x,i)=>i);
      
    })
  }

  result: UserResult = <UserResult>{}
  questionIndexes: number[] = [];
  isLoading = false
}
