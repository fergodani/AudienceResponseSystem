import { Question } from "./question.model";
import { Survey } from "./survey.model";
import { User, UserResult } from "./user.model";


export class Game {

    constructor(host_id: number, survey_id: number, type: GameType, state: GameState, point_type: PointsType, are_questions_visible: boolean, course_id: number) {
        this.survey_id = survey_id;
        this.host_id = host_id;
        this.type = type;
        this.state = state;
        this.are_questions_visible = are_questions_visible;
        this.point_type = point_type;
    }

    id? :number;
    host_id: number = 0;
    survey_id: number = 0;
    type: GameType = GameType.online;
    state: GameState = GameState.created;
    are_questions_visible: boolean = false;
    point_type: PointsType = PointsType.standard;
    course_id: number = 0;
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