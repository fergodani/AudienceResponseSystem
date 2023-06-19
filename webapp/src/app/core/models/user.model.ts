import { AnswerResult } from "./answer.model";
import { Game } from "./game.model";

export class User {

    constructor(username: string, role: string = 'student', id: number = 0) {
        this.id = id;
        this.username = username;
        this.role = role;
    }

    id: number = 0;
    username: string = '';
    password?: string = '';
    role: string = '';
    roleType?: Role = Role.Student;
    token?: string;
}

export function equals(user1: User, user2: User): boolean {
    if (user1.id != user2.id)
        return false
    if (user1.username != user2.username)
        return false
    if (user1.role != user2.role)
        return false
    return true;
}

export interface Token {
    token: string
}

export interface UserToken {
    iat: number;
    user: User;
}

export enum Role {
    Student = 'student',
    Professor = 'professor',
    Admin = 'admin'
}

export interface UserResult {
    user_id: number;
    game_id: number;
    game?: Game;
    answer_results: AnswerResult[];
    score: number;
    correct_questions?: number;
    survey_title?: string;
    wrong_questions?: number;
    total_questions?: number;
}