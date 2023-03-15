export class Game {

    id? :number;
    host_id: number = 0;
    survey_id: number = 0;
    type: GameType = GameType.online;
    state: GameState = GameState.created;
    are_questions_visible: boolean = false;

}

export enum GameType {
    offline = 'offline',
    online = 'online'
}

export enum GameState {
    created = 'created',
    opened = 'opened',
    closed = 'closed'
}

export enum PointsType {
    standard = 'standard',
    double = 'double',
    no_points = 'no_points'
}