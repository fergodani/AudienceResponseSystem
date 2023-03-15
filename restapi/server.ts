import express from "express"
import cors from 'cors';
import { PrismaClient } from '@prisma/client'
import { Server } from "socket.io";
import { Constants } from './socket/constants'
import { CANCELLED } from "dns";
const bodyParser = require('body-parser')
const app = express()
const port = 5000

const courseRoutes = require('./routes/courseRoutes')
const questionRoutes = require('./routes/questionRoutes')
const surveyRoutes = require('./routes/surveyRoutes')
const userRoutes = require('./routes/userRoutes')
const answerRoutes = require('./routes/answerRoutes')

const {
  joinGame,
  createGame
} = require('./socket/game.socket')

const prisma = new PrismaClient()

app.use(cors())
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.use('/api/course', courseRoutes)
app.use('/api/question', questionRoutes)
app.use('/api/survey', surveyRoutes)
app.use('/api/user', userRoutes)
app.use('/api/answer', answerRoutes)

app.use(express.json({limit: '5mb'}))

const io = new Server({
    cors: {
        origin: "*"
    }
});
  io.on(Constants.CONNECT, (socket) => {
    socket.on('my message', (msg) => {
      console.log(msg)
      io.emit('connectUser', msg)
    });
    socket.on(Constants.CREATE_GAME, createGame)
    socket.on(Constants.JOIN_GAME, joinGame)
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
  io.listen(3333)



app.listen(port, () => {
    console.log(`App running on port ${port}.`)
}).on("error", (error: Error) => {
    console.error('Error occured: ' + error.message);
})
