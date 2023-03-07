import { Answer } from "./answer.model";

export class Question {

    constructor(description: string, subject: string, type: string, answer_time: number, answers: Answer[], id: number = 0) {
        this.description = description;
        this.subject = subject;
        this.type = type;
        this.answer_time = answer_time;
        this.answers = answers;
        this.id = id;
    }

    id: number = 0;
    description: string = '';
    subject: string = '';
    type: string = '';
    answer_time: number = 0;
    answers: Answer[] = []
}

export enum Type {
    multioption,
    true_false,
    short
  }