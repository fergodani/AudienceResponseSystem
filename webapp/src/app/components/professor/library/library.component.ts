import { Component } from '@angular/core';

enum State {
  surveys,
  courses,
  questions
}

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent {

  state: State = State.courses;
  stateType = State;

  changeState(newState: State) {
    this.state = newState;
  }

}
