import { Server } from "socket.io";
import { Constants } from './constants'

export default (io: Server) => {
    io.on(Constants.CONNECT, socket => {

        socket.on(Constants.CREATE_GAME, (game, courseId: string) => {
            console.log("Creando juego...")
            // unirse al juego con el game id
            socket.join(game.id + '')
            io.to(courseId).emit('wait_for_surveys', game)
        });

        socket.on(Constants.JOIN_GAME, (user, id: string) => {
            io.to(id).emit('connectUser', user)
        });
        
        socket.on(Constants.START_GAME, () => {
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