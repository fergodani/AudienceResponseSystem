import { Question } from "./question.model";

export interface Survey {
    id: number;
    title: string;
    user_creator_id: number;
    questions: Question[];
    resource: string;
}