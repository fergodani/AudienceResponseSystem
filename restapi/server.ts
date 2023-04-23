import express from "express"
import cors from 'cors';
import { createServer } from "http";
import { Server } from "socket.io";
import Socket from './socket/game.socket'
const bodyParser = require('body-parser')
const app = express()
const httpServer = createServer(app)
const port = 5000

const courseRoutes = require('./routes/courseRoutes')
const questionRoutes = require('./routes/questionRoutes')
const surveyRoutes = require('./routes/surveyRoutes')
const userRoutes = require('./routes/userRoutes')
const answerRoutes = require('./routes/answerRoutes')
const gameRoutes = require('./routes/gameRoutes')

app.use(cors({
    origin: '*'
}))
app.use(bodyParser.json({limit: '10mb'}))
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
app.use('/api/game', gameRoutes)

app.use(express.json({limit: '50mb'}))

const io = new Server(httpServer,{
  cors: {
      origin: "*"
  }
});
Socket(io);

httpServer.listen(port, () => {
    console.log(`App running on port ${port}.`)
}).on("error", (error: Error) => {
    console.error('Error occured: ' + error.message);
})

