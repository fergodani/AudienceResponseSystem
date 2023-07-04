import { Component, OnInit } from '@angular/core';
import { Course } from '@app/core/models/course.model';
import { Game } from '@app/core/models/game.model';
import { ApiAuthService } from '@app/core/services/auth/api.auth.service';
import { ApiStudentService } from '@app/core/services/user/api.user.service';
import { SocketioService } from '@app/core/services/socket/socketio.service';

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.css']
})
export class StudentHomeComponent implements OnInit {
  constructor(
    private apiStudentService: ApiStudentService,
    private socketService: SocketioService,
    private authService: ApiAuthService
  ) {
  }

  ngOnInit(): void {
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
        this.games.push(game)
    })
  }

  courses: Course[] = [];
  isLoading: boolean = false;
  isLoadingGames: boolean = false;
  games: Game[] = [];

}
