import { Question } from "./question.model";
import { Survey } from "./survey.model";
import { User, UserResult } from "./user.model";

export interface Game {
    id: number;
    host_id: number;
    survey_id: number;
    type: GameType;
    state: GameState;
    are_questions_visible: boolean;
    point_type: PointsType;
    user?: User;
    survey?: Survey;
}

export enum GameType {
    offline = 'offline',
    online = 'online'
}

export enum GameState {
    created = 'created',
    started = 'started',
    closed = 'closed'
}

export enum PointsType {
    standard = 'standard',
    double = 'double',
    no_points = 'no_points'
}

export interface GameSession {
    game: Game;
    users: User[];
    state: GameSessionState;
    question_list: Question[];
    question_index: number;
    user_results: UserResult[];
}

export enum GameSessionState {
    not_started,
    is_leaderboard_screen,
    is_preview_screen,
    is_question_screen,
    is_question_result,
    is_finished
}