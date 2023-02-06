import express from "express"
const bodyParser = require('body-parser')
const app = express()
const port = 3000

const courseRoutes = require('./routes/courseRoutes')
const questionRoutes = require('./routes/questionRoutes')
const surveyRoutes = require('./routes/surveyRoutes')
const userRoutes = require('./routes/userRoutes')

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

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

app.use(express.json({limit: '5mb'}))


app.listen(port, () => {
    console.log(`App running on port ${port}.`)
}).on("error", (error: Error) => {
    console.error('Error occured: ' + error.message);
})
