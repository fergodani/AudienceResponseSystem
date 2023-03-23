import { Question } from "./question.model";

export class Survey {

    constructor(title: string, user_creator_id: number, questions: Question[], resource: string, id: number = 0){
        this.id = id;
        this.title = title;
        this.user_creator_id = user_creator_id;
        this.questions = questions;
        this.resource = resource;
    }

    id?: number;
    title: string = '';
    user_creator_id: number = -1;
    questions: Question[] = [];
    resource: string = '';
}

export function equals(survey1: Survey, survey2: Survey): boolean {
    if (survey1.id != survey2.id)
        return false
    if (survey1.title != survey2.title)
        return false
    if (survey1.user_creator_id != survey2.user_creator_id)
        return false
    return true;
}
