import { Component, EventEmitter, Output } from '@angular/core';
import { GameSession } from '@app/core/models/game.model';
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
      //this.socketService.users.subscribe( (users: User[]) => {this.userList = users; this.users.emit(this.userList)})
      
    }

  //userList: User[] = [];
  gameSession: GameSession = <GameSession>{}
  @Output() users = new EventEmitter<User[]>();

}
