import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Survey } from '@app/core/models/survey.model';
import { ApiProfessorService } from '@app/core/services/professor/api.professor.service';

@Component({
  selector: 'app-update-survey',
  templateUrl: './update-survey.component.html',
  styleUrls: ['./update-survey.component.css']
})
export class UpdateSurveyComponent implements OnInit{

  constructor(
    private apiProfessorService: ApiProfessorService,
    private actRoute: ActivatedRoute,
    private router: Router,
    ) {}

  ngOnInit(): void {
    const id = this.actRoute.snapshot.paramMap.get('id');
    if (id == null)
      this.router.navigate(['/library'])
    this.isLoading = true
    this.apiProfessorService
    .getSurveyById(Number(id))
    .subscribe(survey => {
      this.survey = survey
      this.isLoading = false
    })
  }

  isLoading = false
  survey: Survey | undefined

}
