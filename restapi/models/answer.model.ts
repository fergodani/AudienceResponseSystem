export interface Answer {
    question_id?: string;
    description: string;
    is_correct: boolean;
}

export interface AnswerResult {
    game_id: number;
    user_id: number;
    answer_id?: number;
    question_index: number;
    answered: boolean;
}