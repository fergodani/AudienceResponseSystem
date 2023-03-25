export class Answer {

    constructor(description: string, is_correct: boolean) {
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
    question_id: number;
    answer_id?: number;
    answer?: Answer;
    short_answer?: string;
    question_index: number;
    answered: boolean;
}

