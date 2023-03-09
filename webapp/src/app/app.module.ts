import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

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
import { RouterModule, Routes } from '@angular/router';
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

const appRoutes: Routes=[
  {path: '', component: AdminHomeComponent},
  {path: 'users', component: UserListComponent},
  {path: 'users/create', component: CreateUserFormComponent},
  {path: 'courses', component: CourseListComponent},
  {path: 'courses/create', component: CreateCourseFormComponent},
  {path: 'users/update/:id', component: UpdateUserFormComponent},
  {path: 'courses/update/:id', component: UpdateCourseFormComponent},
  {path: 'questions/create', component: CreateQuestionComponent},
  {path: 'questions/list', component: QuestionListComponent},
  {path: 'login', component: LoginFormComponent},
  {path: 'student/home', component: StudentHomeComponent},
  {path: 'professor/home', component: ProfessorHomeComponent},
  {path: 'admin/home', component: AdminHomeComponent},
  { path: '**', component: AdminHomeComponent }
];

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    MatIconModule,
    MatSidenavModule,
    MatNativeDateModule,
    MaterialExampleModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
