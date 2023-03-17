import { Component } from '@angular/core';
import { Course } from '@app/core/models/course.model';
import { Game } from '@app/core/models/game.model';
import { Survey } from '@app/core/models/survey.model';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { ApiProfessorService } from '@app/core/services/professor/api.professor.service';
import { ApiStudentService } from '@app/core/services/user/api.user.service';
import { SocketioService } from '@app/core/socket/socketio.service';

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.css']
})
export class StudentHomeComponent {

  constructor(
    private apiStudentService: ApiStudentService,
    private apiProfessorService: ApiProfessorService,
    private socketService: SocketioService,
    private authService: ApiAuthService
  ) {
    this.isLoading = true;
    this.apiStudentService
      .getCoursesByUser(this.authService.userValue!.id)
      .subscribe(courses => {
        this.courses = courses;
        this.isLoading = false;
        if (courses.length != 0) {
          this.connectToSocket(courses);
        }
      })

  }

  connectToSocket(courses: Course[]) {
    this.isLoadingGames = true;
    this.apiStudentService
      .getOpenGamesByCourses(courses)
      .subscribe(games => {
        this.games = this.games.concat(games);
        this.isLoadingGames = false;
      })
    this.socketService.gamesAvailable.subscribe((games: Game[]) => {
      this.games = this.games.concat(games)
    })
    this.socketService.setupSocketConnection();
    this.socketService.joinSocketCourses(courses)
    this.socketService.waitForSurveys();
  }

  courses: Course[] = [];
  isLoading: boolean = false;
  isLoadingGames: boolean = false;
  games: Game[] = [];

}
