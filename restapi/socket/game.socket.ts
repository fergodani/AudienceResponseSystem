import { Server } from "socket.io";
import { Game, GameState } from "../models/game.model";
import { User } from "../models/user.model";
import { Constants } from './constants'

let game: Game;
let students: User[] = [];

export default (io: Server) => {
    io.on(Constants.CONNECT, socket => {

        socket.on(Constants.CREATE_GAME, (newGame, courseId: string) => {
            game = newGame;
            console.log("Creando juego...")
            // unirse al juego con el game id
            socket.join(game.id + '')
            io.to(courseId).emit('wait_for_surveys', game)
        });

        socket.on(Constants.JOIN_GAME, (newUser, id: string) => {
            !students.some( student => newUser.id === student.id) && students.push(newUser)
            let user = students.find( student => student.id == newUser.id);
            socket.join(id)
            io.to(id).emit('connectUser', user)
        });
        
        socket.on(Constants.START_GAME, (game: Game) => {
            console.log("Empezando juego...")
            game.state = GameState.started;
            io.to(game.id + '').emit('move_to_survey', game);
        });

        socket.on(Constants.START_QUESTION_TIME, () => {
        });

        socket.on(Constants.SEND_ANSWER, () => {
        });

        socket.on(Constants.DISCONNECT, () => {
            console.log('user disconnected');
        });

        socket.on(Constants.JOIN_SOCKET_COURSE, (courseIds: string[]) => {
            socket.join(courseIds)
        })


    });
}