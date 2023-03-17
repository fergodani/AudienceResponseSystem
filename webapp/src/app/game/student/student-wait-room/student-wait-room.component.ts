import { Component } from '@angular/core';
import { SocketioService } from '@app/core/socket/socketio.service';

@Component({
  selector: 'app-student-wait-room',
  templateUrl: './student-wait-room.component.html',
  styleUrls: ['./student-wait-room.component.css']
})
export class StudentWaitRoomComponent {

  constructor(private socketService: SocketioService) {}

}
