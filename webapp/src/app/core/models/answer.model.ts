export class Answer {

    constructor(description: string, is_correct: boolean, id: number = 0) {
        this.id = id;
        this.description = description;
        this.is_correct = is_correct;
    }

    id?: number;
    description: string='';
    is_correct: boolean=false;
}

export interface AnswerResult {
    game_id: number;
    user_id: number;
    answer_id?: number;
    answer?: Answer
    question_index: number;
    answered: boolean;
}

