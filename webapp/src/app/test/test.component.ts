import { Component, OnInit } from '@angular/core';
import { Type } from '@app/core/models/question.model';
import { User } from '@app/core/models/user.model';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  ngOnInit(): void {
    this.startPreviewCountdown(5)
  }

  game = {
    are_questions_visible: true
  }

  gameSession = {
    users: [
      {
        username: "User 1"
      },
      {
        username: "User 2"
      },
      {
        username: "User 3"
      },
      {
        username: "User 4"
      },
      {
        username: "User 5"
      },
      {
        username: "User 6"
      },
    ]
  }

  correctAnswers = [
    {
      description: "La Primera Ley"
    }
  ]

  actualQuestion = {
    resource: "",
    type: Type.short,
    description: "Cómo se llama la saga a la que corresponde el siguiente mapa:",
    answers: [
      {
        description: "Respuesta 1 de ejemplo jejeje"
      },
      {
        description: "Respuesta 2 de ejemplo jejeje"
      },
      {
        description: "Respuesta 3 de ejemplo jejeje"
      },
      {
        description: "Respuesta 4 de ejemplo jejeje"
      }
    ]
  }

  timeLeft = 10
  value = 0

  startPreviewCountdown(seconds: number) {
    let time = seconds;
    let valueAux = 0
    let interval = setInterval(() => {
      this.timeLeft = time;
      if (time > 0) {
        time--;
        valueAux++;
        this.value = (valueAux/seconds) * 100;
      } else {
        clearInterval(interval);
      }
    }, 1000)
  }

}
