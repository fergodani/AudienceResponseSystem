import express, { Router } from 'express'
const api: Router = express.Router()

const {
    getGames,
    createGame,
    getOpenGamesByCourses,
    updateGame,
    createResults,
    getGamesResultsByUser
} = require('../controllers/gameController')

api.get("/", getGames)

api.get("/course", getOpenGamesByCourses)

api.get("/results/:id", getGamesResultsByUser)

api.post("/", createGame)

api.post("/results", createResults)

api.put("/", updateGame)

module.exports = api