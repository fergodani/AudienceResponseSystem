import { Server } from "socket.io";
import { Game, GameSession, GameSessionState, GameState } from "../models/game.model";
import { User, UserResult } from "../models/user.model";
import { Constants } from './constants'

let game: Game;
let students: User[] = [];
let gameSessions = new Map<string, GameSession>()


export default (io: Server) => {
    io.on(Constants.CONNECT, socket => {
        if (socket.recovered) {
            console.log("Socket recovered")
        } else {
            console.log("First connection")
        }

        socket.on(Constants.CREATE_GAME, (newGame, courseId: string, callback) => {
            game = newGame;
            console.log("Creando juego...")
            // unirse al juego con el game id
            if (game) {
                socket.join(game.id + '')
                let gameSession: GameSession = {
                    game,
                    users: [],
                    state: GameSessionState.not_started,
                    question_list: [],
                    question_index: 0,
                    user_results: []
                }
                gameSessions.set(game.id + '', gameSession)
                io.to(courseId).emit('wait_for_surveys', game)
            } else {
                callback("No existe el juego")
            }
        });

        socket.on("look_for_game_session", (id: number) => {
            const gameSession = gameSessions.get(id + '')
            socket.to(id + '').emit('wait_for_game_session', gameSession)
        })

        socket.on(Constants.JOIN_GAME, (newUser, id: string) => {
            let user = gameSessions.get(id)?.users.find(student => student.id == newUser.id)
            console.log("User joning...")
            if (!user)
                gameSessions.get(id)?.users.push(newUser)
            socket.join(id)
            io.to(id).emit('connectUser', gameSessions.get(id))
        });

        socket.on(Constants.START_GAME, (game: Game) => {
            console.log("Empezando juego...")
            game.state = GameState.started;
            io.to(game.id + '').emit('move_to_survey', game);
        });

        socket.on(Constants.QUESTION_PREVIEW, (cb) => {
            cb();
            console.log("Question preview...")
            socket.to(game.id + '').emit('host-start-preview');
        })

        socket.on(Constants.START_QUESTION_TIME, (time, question, cb) => {
            cb();
            socket.to(game.id + '').emit('host-start-question-timer', time, question);
        });

        socket.on(Constants.SEND_ANSWER, (result: UserResult) => {
            console.log("Enviando respuesta...")
            socket.to(game.id + '').emit("get-answer-from-player", JSON.stringify(result))
        });

        socket.on(Constants.DISCONNECT, () => {
            console.log('user disconnected');
        });

        socket.on(Constants.JOIN_SOCKET_COURSE, (courseIds: string[]) => {
            socket.join(courseIds)
        })

        socket.on(Constants.FINISH_GAME, () => {
            console.log("finishing game...")
            socket.to(game.id + '').emit('finish_game');
        })

        socket.on('leave_game', () => {
            socket.leave(game.id + '');
        })

        socket.on('game_over', (callback) => {
            console.log('game over')
            callback('hola amigo')
            socket.leave(game.id + '');
        })
    });
}