export interface Answer {
    question_id?: string;
    description: string;
    is_correct: boolean;
}

export interface AnswerResult {
    answer: Answer;
    question_index: number;
    answered: boolean;
}