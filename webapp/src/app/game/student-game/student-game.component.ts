import { Component, OnInit } from '@angular/core';
import { SocketioService } from '@app/core/socket/socketio.service';

@Component({
  selector: 'app-student-game',
  templateUrl: './student-game.component.html',
  styleUrls: ['./student-game.component.css']
})
export class StudentGameComponent implements OnInit{


  constructor(private socketService: SocketioService) {}

  CHAT_ROOM = "myRandomChatRoomId";
  
  ngOnInit() {
    this.socketService.setupSocketConnection();
    this.socketService.sendUser();
  }

}
