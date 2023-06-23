import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from '@app/core/models/message.model';
import { equals, Survey } from '@app/core/models/survey.model';
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

  @Input() isSelecting: boolean = false;
  @Output() surveyToAdd = new EventEmitter<Survey>
  @Input() surveysAdded: Survey[] = [];

  async createNewSurvey() {
    await this.route.navigate(['survey/create'])
  }

  addSurveyToCourse(survey: Survey) {
    this.surveyToAdd.emit(survey)
    this.surveysAdded.push(survey);
  }

  isInclude(survey: Survey){
    let value = false
    this.surveysAdded.forEach( surveyToCompare => {
      if(equals(survey, surveyToCompare))
        value = true;
    })
    return value;
  }

  deleteSurvey(survey: Survey) {
    console.log(survey)
    this.apiProfessorService
    .deleteSurvey(survey.id!)
    .subscribe((msg: Message) => {
      alert(msg.message)
      this.surveys = this.surveys.filter((s) => s.id != survey.id)
    })
  }

}
