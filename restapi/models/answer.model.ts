export interface Answer {
    id?: number;
    question_id?: string;
    description: string;
    is_correct: boolean;
}

export interface AnswerResult {
    game_id: number;
    user_id: number;
    question_id: number;
    answer_id?: number;
    short_answer?: string;
    question_index: number;
    answered: boolean;
    is_correct?: boolean;
}