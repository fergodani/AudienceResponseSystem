import { Answer } from "./answer.model";
import { User } from "./user.model";

export interface Question{
    id: number;
    description: string;
    subject: string;
    type: string;
    answer_time: number;
    answers: Answer[];
    resource: string;
    user_creator_id: number;
}

export interface QuestionResult {
    questionIndex: number;
    user: User;
    user_points: number;
}