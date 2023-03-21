import express, { Router } from 'express'
const api: Router = express.Router()

const {
    getGames,
    createGame,
    getOpenGamesByCourses,
    updateGame,
    createResults
} = require('../controllers/gameController')

api.get("/", getGames)

api.get("/course", getOpenGamesByCourses)

api.post("/", createGame)

api.post("/results", createResults)

api.put("/", updateGame)

module.exports = api