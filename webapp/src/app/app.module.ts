import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminHomeComponent } from './admin/home/admin-home.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { CreateUserFormComponent } from './admin/create-user-form/create-user-form.component';

import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from './core/services/admin/api.admin.service';
import { CreateCourseFormComponent } from './admin/create-course-form/create-course-form.component';
import { UserListComponent } from './admin/user-list/user-list.component';
import { CourseListComponent } from './admin/course-list/course-list.component';
import { UpdateUserFormComponent } from './admin/update-user-form/update-user-form.component';
import { UpdateCourseFormComponent } from './admin/update-course-form/update-course-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatNativeDateModule} from '@angular/material/core';
import { CreateQuestionComponent } from './professor/create-question/create-question.component';
import {MaterialExampleModule} from '../material.module';
import { AnswersComponent } from './professor/create-question/answers/answers.component';
import { QuestionListComponent } from './professor/question-list/question-list.component';
import { LoginFormComponent } from './login/login-form/login-form.component';
import { ProfessorHomeComponent } from './professor/professor-home/professor-home.component';
import { StudentHomeComponent } from './student/student-home/student-home.component';
import { JwtInterceptor } from './core/helpers/jwt.interceptor';
import { ErrorInterceptor } from './core/helpers/error.interceptor';
import { CreateSurveyComponent } from './professor/create-survey/create-survey.component';
import { SurveyListComponent } from './professor/survey-list/survey-list.component';
import { LibraryComponent } from './professor/library/library.component';
import { CourseDetailsComponent } from './professor/course-details/course-details.component';
import { LinkUserCourseComponent } from './professor/dialogs/link-user-course/link-user-course.component';
import { LinkSurveyCourseComponent } from './professor/dialogs/link-survey-course/link-survey-course.component';
import { LinkQuestionCourseComponent } from './professor/dialogs/link-question-course/link-question-course.component';
import { HostGameComponent } from './game/host/host-game/host-game.component';
import { StudentGameComponent } from './game/student/student-game/student-game.component';
import { HostWaitRoomComponent } from './game/host/host-wait-room/host-wait-room.component';
import { CreateGameDialogComponent } from './professor/dialogs/create-game-dialog/create-game-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminHomeComponent,
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
    ProfessorHomeComponent,
    StudentHomeComponent,
    CreateSurveyComponent,
    SurveyListComponent,
    LibraryComponent,
    CourseDetailsComponent,
    LinkUserCourseComponent,
    LinkSurveyCourseComponent,
    LinkQuestionCourseComponent,
    HostGameComponent,
    StudentGameComponent,
    HostWaitRoomComponent,
    CreateGameDialogComponent
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
    MaterialExampleModule
  ],
  providers: [
    ApiService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
