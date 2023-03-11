import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Survey } from '@app/core/models/survey.model';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { ApiProfessorService } from '@app/core/services/professor/api.professor.service';

@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.css']
})
export class SurveyListComponent implements OnInit{

  constructor(
    private apiProfessorService: ApiProfessorService,
    private authService: ApiAuthService,
    private route: Router
  ){
    
  }
  ngOnInit(): void {
    this.isLoading = true;
    this.apiProfessorService
    .getSurveysByUser(this.authService.userValue!.id)
    .subscribe(surveys => {this.surveys = surveys; this.isLoading = false})
  }

  isLoading: boolean = false;
  surveys: Survey[] = [];

  createNewSurvey() {
    this.route.navigate(['survey/create'])
  }

}
