import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '@app/core/models/user.model';
import { SocketioService } from '@app/core/socket/socketio.service';

@Component({
  selector: 'app-host-game',
  templateUrl: './host-game.component.html',
  styleUrls: ['./host-game.component.css']
})
export class HostGameComponent implements OnInit {

  constructor(
    private socketService: SocketioService,
    private route: ActivatedRoute
    ) {
      this.socketService.users.subscribe( (users: User[]) => {this.users = users;})
    }
  users: User[] = [];
  
  ngOnInit() {
    this.socketService.setupHostSocketConnection();
    this.route.queryParams
    .subscribe(params => {
      console.log(params);
    })

    // Con esto crear el juego y subirlo al servidor
  }

}
