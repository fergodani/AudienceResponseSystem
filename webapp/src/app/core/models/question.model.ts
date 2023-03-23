import { Answer } from "./answer.model";
import { User } from "./user.model";

export class Question {

    constructor(description: string, subject: string, type: string, answer_time: number, answers: Answer[], resource: string, user_creator_id: number) {
        this.description = description;
        this.subject = subject;
        this.type = type;
        this.answer_time = answer_time;
        this.answers = answers;
        this.resource = resource;
        this.user_creator_id = user_creator_id;
    }

    id: number = 0;
    description: string = '';
    subject: string = '';
    type: string = '';
    answer_time: number = 0;
    answers: Answer[] = []
    resource: string = '';
    user_creator_id: number = 0;
}

export enum Type {
    multioption,
    true_false,
    short
  }
