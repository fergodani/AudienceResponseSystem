import { Survey } from "./survey.model";
import { User } from "./user.model";

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