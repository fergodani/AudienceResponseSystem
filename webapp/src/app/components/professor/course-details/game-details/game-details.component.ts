import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserResult } from '@app/core/models/user.model';
import { ApiProfessorService } from '@app/core/services/professor/api.professor.service';

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.css']
})
export class GameDetailsComponent{

  constructor(
    private apiProfessorService: ApiProfessorService,
    private actRoute: ActivatedRoute,
    private router: Router
  ) {
    this.isLoading = true
    const id = this.actRoute.snapshot.paramMap.get('id');
    this.apiProfessorService
    .getGameResultsByGame(Number(id))
    .subscribe(results =>{ this.results = results; this.isLoading = false})
  }

  
  results: UserResult[] = []
  isLoading = false;

  displayedColumns: string[] = ['user', 'score', 'correct_answers', 'wrong_answers', 'total_answers'];

  async backToCourse() {
    await this.router.navigate(['/course/details', this.results[0].game?.course_id])
  }
}
