import express from "express"
import cors from 'cors';
import { createServer } from "http";
import { Server } from "socket.io";
import Socket from './socket/game.socket'
import fs from "fs"; 
import path from "path";
const bodyParser = require('body-parser')
const app = express()
const httpServer = createServer(app)
const port = 5000
const https = require("https")

let credentials = {key: fs.readFileSync("./certificate/privateKey.key"),
 cert: fs.readFileSync("./certificate/certificate.crt")}

const httpsServer = https.createServer(credentials, app);

const courseRoutes = require('./routes/courseRoutes')
const questionRoutes = require('./routes/questionRoutes')
const surveyRoutes = require('./routes/surveyRoutes')
const userRoutes = require('./routes/userRoutes')
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
app.use('/api/game', gameRoutes)

app.use(express.json({limit: '50mb'}))

const io = new Server(httpsServer,{
  cors: {
      origin: "*"
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true
  }
});
Socket(io);

httpsServer.listen(port, () => {
    console.log(`App running on port ${port}.`)
}).on("error", (error: Error) => {
    console.error('Error occured: ' + error.message);
})

