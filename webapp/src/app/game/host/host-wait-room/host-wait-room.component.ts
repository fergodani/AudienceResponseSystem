import { Component, OnInit } from '@angular/core';
import { User } from '@app/core/models/user.model';
import { SocketioService } from '@app/core/socket/socketio.service';

@Component({
  selector: 'app-host-wait-room',
  templateUrl: './host-wait-room.component.html',
  styleUrls: ['./host-wait-room.component.css']
})
export class HostWaitRoomComponent {

  constructor(
    private socketService: SocketioService
    ) {
      this.socketService.users.subscribe( (users: User[]) => {this.users = users;})
    }
  users: User[] = [];

  startGame() {
    this.socketService.startGame()
  }

}
