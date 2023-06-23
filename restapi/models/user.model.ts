import { AnswerResult } from "./answer.model";
import { Game } from "./game.model";

export interface User {
    id: number;
    username: string;
    password: string;
    role: string;
    roleType: Role;
    token?: string;
}

export enum Role {
    Student = 'student',
    Professor = 'professor',
    Admin = 'admin'
}

export interface UserResult {
    user_id: number;
    game_id: number;
    answer_results: AnswerResult[];
    score: number;
    total_questions: number;
    correct_questions: number;
    wrong_questions: number;
}