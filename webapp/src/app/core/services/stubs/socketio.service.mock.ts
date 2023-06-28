import { Game, GameSession, GameSessionState, GameState, GameType, PointsType } from "@app/core/models/game.model";

export class SocketioServiceStub {

    socket = {
        emit(data: string, game: Game, course_id: number, cb: any) {
            const gameSession: GameSession = {
                game: {
                  host_id: 1,
                  survey_id: 1,
                  type: GameType.online,
                  state: GameState.created,
                  are_questions_visible: true,
                  point_type: PointsType.standard,
                  course_id: 1
                },
                users: [
                  {
                    id: 1,
                    username: "testUser1",
                    role: 'student'
                  },
                  {
                    id: 2,
                    username: "testUser2",
                    role: 'student'
                  }
                ],
                state: GameSessionState.not_started,
                question_list: [],
                question_index: 0,
                user_results: []
              }
            if(cb != undefined)
              cb(gameSession);
        },
        on() {}
    }

    setupSocketConnection () {
      
    }
}