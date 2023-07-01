import { Server } from "socket.io";
import { Game, GameSession, GameSessionState } from "../models/game.model";
import { UserResult } from "../models/user.model";
import { Constants } from './constants'
import { Question, QuestionSurvey } from "../models/question.model";

let gameSessions = new Map<string, GameSession>()


export default (io: Server) => {
    io.on(Constants.CONNECT, socket => {
        if (socket.recovered) {
            console.log("Socket recovered")
        } else {
            console.log("First connection")
        }

        socket.on(Constants.CREATE_GAME, (newGame: Game, courseId: string, callback) => {
            console.log("Creando juego...")
            if (newGame) {
                socket.join(newGame.id + '')
                let questionList: Question[] = []
                newGame.survey?.questionsSurvey!.forEach((qS: QuestionSurvey) => {
                    qS.question!!.position = qS.position
                })
                newGame.survey?.questionsSurvey!.forEach((qS: QuestionSurvey) => {
                    questionList.push(qS.question!)
                })
                questionList.sort((q1, q2) => { return q1.position! - q2.position! })
                let gameSession: GameSession = {
                    game: newGame,
                    users: [],
                    state: GameSessionState.not_started,
                    question_list: questionList,
                    question_index: 0,
                    user_results: [],
                    socket_id: socket.id
                }
                gameSessions.set(newGame.id + '', gameSession)
                io.to(courseId).emit('wait_for_surveys', newGame)
                callback(gameSession)
            }
        });

        socket.on(Constants.JOIN_GAME, (newUser, id: string, cb) => {
            let user = gameSessions.get(id)?.users.find(student => student.id == newUser.id)
            console.log("User joning...")
            if (!user)
                gameSessions.get(id)?.users.push(newUser)
            socket.join(id + '')
            io.to(id + '').emit('connectUser', gameSessions.get(id))
            cb(gameSessions.get(id))
        });

        socket.on(Constants.QUESTION_PREVIEW, (gameSession: GameSession, cb) => {
            cb()
            console.log("Question preview...")
            socket.to(gameSession.game.id + '').emit('host-start-preview', gameSession);
        })

        socket.on(Constants.START_QUESTION_TIME, (gameSession: GameSession, cb) => {
            cb();
            gameSessions.set(gameSession.game.id + '', gameSession)
            socket.to(gameSession.game.id  + '').emit('host-start-question-timer', gameSession);
        });

        socket.on(Constants.FINISH_QUESTION, (gameSession: GameSession, cb) => {
            cb()
            console.log("Finishing question...")
            gameSessions.set(gameSession.game.id + '', gameSession)
            socket.to(gameSession.game.id + '').emit("finish_question", gameSession)
        })

        socket.on(Constants.SHOW_SCORE, (gameSession: GameSession, cb) => {
            cb()
            console.log("Showing score...")
            socket.to(gameSession.game.id + '').emit('show_score', gameSession)
        })

        socket.on(Constants.SEND_ANSWER, (id, result: UserResult) => {
            console.log("Enviando respuesta...")
            socket.to(id + '').emit("get-answer-from-player", result)
        });

        socket.on(Constants.DISCONNECT, () => {
            const sessionArray = Array.from(gameSessions.values())
            const sessionDisconnected = sessionArray.find((s) => s.socket_id === socket.id)
            if (sessionDisconnected) {
                console.log("Game Over")
                sessionDisconnected.state = GameSessionState.is_finished
                socket.to(sessionDisconnected.game.id + "").emit("finish_game", sessionDisconnected)
            }
            console.log('user disconnected');
        });

        socket.on(Constants.JOIN_SOCKET_COURSE, (courseIds: string[]) => {
            socket.join(courseIds)
        })

        socket.on(Constants.FINISH_GAME, (gameSession: GameSession) => {
            console.log("finishing game...")
            socket.to(gameSession.game.id + '').emit('finish_game', gameSession);
        })

        socket.on(Constants.LEAVE_GAME, (id) => {
            socket.leave(id + '');
        })
    });
}