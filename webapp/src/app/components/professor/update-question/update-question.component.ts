import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Question } from '@app/core/models/question.model';
import { ApiProfessorService } from '@app/core/services/professor/api.professor.service';

@Component({
  selector: 'app-update-question',
  templateUrl: './update-question.component.html',
  styleUrls: ['./update-question.component.css']
})
export class UpdateQuestionComponent implements OnInit{

  constructor(
    private actRoute: ActivatedRoute,
    private router: Router,
    private apiProfessorService: ApiProfessorService
    ) {}

  ngOnInit(): void {
    const id = this.actRoute.snapshot.paramMap.get('id');
    if (id == null){
      (async () => {
        await this.router.navigate(['/library'])
      })()
    }
    this.isLoading = true;
    this.apiProfessorService
    .getQuestionById(Number(id))
    .subscribe((question) => {
      this.question = question
      this.isLoading = false
    })
  }

  isLoading = false
  question!: Question;

}
