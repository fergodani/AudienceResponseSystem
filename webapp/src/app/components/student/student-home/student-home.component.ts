import { Component } from '@angular/core';
import { Course } from '@app/core/models/course.model';
import { Game } from '@app/core/models/game.model';
import { Survey } from '@app/core/models/survey.model';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { ApiProfessorService } from '@app/core/services/professor/api.professor.service';
import { ApiStudentService } from '@app/core/services/user/api.user.service';
import { SocketioService } from '@app/core/socket/socketio.service';
import { TranslateService } from '@ngx-translate/core';
import { isEmpty } from 'rxjs';

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.css']
})
export class StudentHomeComponent {
  selectedLanguage = 'es';
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
      .getOpenOrStartedGamesByCourses(courses)
      .subscribe(games => {
        this.games = games
        this.isLoadingGames = false;
      })

    this.socketService.setupSocketConnection();
    this.socketService.joinSocketCourses(courses)
    this.socketService.waitForSurveys();
    this.socketService.newGame.subscribe((game: Game) => {
        console.log(game)
        this.games.push(game)
    })
  }

  courses: Course[] = [];
  isLoading: boolean = false;
  isLoadingGames: boolean = false;
  games: Game[] = [];

}
