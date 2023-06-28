import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { CreateUserFormComponent } from './components/admin/create-user-form/create-user-form.component';

import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateCourseFormComponent } from './components/admin/create-course-form/create-course-form.component';
import { UserListComponent } from './components/admin/user-list/user-list.component';
import { CourseListComponent } from './components/admin/course-list/course-list.component';
import { UpdateUserFormComponent } from './components/admin/update-user-form/update-user-form.component';
import { UpdateCourseFormComponent } from './components/admin/update-course-form/update-course-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatNativeDateModule } from '@angular/material/core';
import { CreateQuestionComponent } from './components/professor/create-question/create-question.component'
import { MaterialExampleModule } from '../material.module';
import { AnswersComponent } from './components/professor/create-question/answers/answers.component';
import { QuestionListComponent } from './components/professor/question-list/question-list.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { StudentHomeComponent } from './components/student/student-home/student-home.component';
import { JwtInterceptor } from './core/helpers/jwt.interceptor';
import { ErrorInterceptor } from './core/helpers/error.interceptor';
import { CreateSurveyComponent } from './components/professor/create-survey/create-survey.component';
import { SurveyListComponent } from './components/professor/survey-list/survey-list.component';
import { LibraryComponent } from './components/professor/library/library.component';
import { CourseProfessorDetailsComponent } from './components/professor/course-details/course-details.component';
import { LinkUserCourseComponent } from './components/professor/dialogs/link-user-course/link-user-course.component';
import { LinkSurveyCourseComponent } from './components/professor/dialogs/link-survey-course/link-survey-course.component';
import { LinkQuestionCourseComponent } from './components/professor/dialogs/link-question-course/link-question-course.component';
import { HostGameComponent } from './components/professor/host-game/host-game.component';
import { StudentGameComponent } from './components/student/student-game/student-game.component';
import { CreateGameDialogComponent } from './components/professor/dialogs/create-game-dialog/create-game-dialog.component';
import { StudentProfileComponent } from './components/student/student-profile/student-profile.component';
import { UpdateQuestionComponent } from './components/professor/update-question/update-question.component';
import { UpdateSurveyComponent } from './components/professor/update-survey/update-survey.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { CourseStudentDetailsComponent } from './components/student/course-details/course-details.component';
import { GameDetailsComponent } from './components/professor/course-details/game-details/game-details.component';
import { GameRevisionComponent } from './components/student/course-details/game-revision/game-revision.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    CreateUserFormComponent,
    CreateCourseFormComponent,
    UserListComponent,
    CourseListComponent,
    UpdateUserFormComponent,
    UpdateCourseFormComponent,
    CreateQuestionComponent,
    AnswersComponent,
    QuestionListComponent,
    LoginFormComponent,
    StudentHomeComponent,
    CreateSurveyComponent,
    SurveyListComponent,
    LibraryComponent,
    CourseProfessorDetailsComponent,
    CourseStudentDetailsComponent,
    LinkUserCourseComponent,
    LinkSurveyCourseComponent,
    LinkQuestionCourseComponent,
    HostGameComponent,
    StudentGameComponent,
    CreateGameDialogComponent,
    StudentProfileComponent,
    UpdateQuestionComponent,
    UpdateSurveyComponent,
    ErrorPageComponent,
    GameDetailsComponent,
    GameRevisionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatSidenavModule,
    MatNativeDateModule,
    MaterialExampleModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
