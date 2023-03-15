import { Answer } from "./answer.model";

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