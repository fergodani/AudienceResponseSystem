import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseListComponent } from './admin/course-list/course-list.component';
import { CreateCourseFormComponent } from './admin/create-course-form/create-course-form.component';
import { CreateUserFormComponent } from './admin/create-user-form/create-user-form.component';
import { AdminHomeComponent } from './admin/home/admin-home.component';
import { UpdateCourseFormComponent } from './admin/update-course-form/update-course-form.component';
import { UpdateUserFormComponent } from './admin/update-user-form/update-user-form.component';
import { UserListComponent } from './admin/user-list/user-list.component';
import { AuthGuard } from './core/helpers/auth.guard';
import { Role } from './core/models/user.model';
import { LoginFormComponent } from './login/login-form/login-form.component';
import { CreateQuestionComponent } from './professor/create-question/create-question.component';
import { CreateSurveyComponent } from './professor/create-survey/create-survey.component';
import { LibraryComponent } from './professor/library/library.component';
import { ProfessorHomeComponent } from './professor/professor-home/professor-home.component';
import { QuestionListComponent } from './professor/question-list/question-list.component';
import { SurveyListComponent } from './professor/survey-list/survey-list.component';
import { StudentHomeComponent } from './student/student-home/student-home.component';

const routes: Routes = [
  {
    path: '',
    component: LoginFormComponent
  },
  {
    path: 'users', 
    component: UserListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin]}
  },
  {
    path: 'users/create', 
    component: CreateUserFormComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin]}
  },
  {
    path: 'courses', 
    component: CourseListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin, Role.Professor]}
  },
  {
    path: 'courses/create', 
    component: CreateCourseFormComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin]}
  },
  {
    path: 'users/update/:id', 
    component: UpdateUserFormComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin]}
  },
  {
    path: 'courses/update/:id', 
    component: UpdateCourseFormComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin]}
  },
  {
    path: 'questions/create', 
    component: CreateQuestionComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Professor]}
  },
  {
    path: 'survey/create', 
    component: CreateSurveyComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Professor]}
  },
  {
    path: 'survey/list', 
    component: SurveyListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Professor]}
  },
  {
    path: 'library', 
    component: LibraryComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Professor]}
  },
  {
    path: 'questions/list', 
    component: QuestionListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Professor]}
  },
  {
    path: 'login', 
    component: LoginFormComponent
  },
  {
    path: 'student/home', 
    component: StudentHomeComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Student]}
  },
  {
    path: 'professor/home', 
    component: ProfessorHomeComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Professor]}
  },
  {
    path: 'admin/home', 
    component: AdminHomeComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin]}
  },
  {
    path: '**', component: AdminHomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
