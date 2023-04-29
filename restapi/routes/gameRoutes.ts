import express, { Router } from 'express'
const api: Router = express.Router()

const {
    getGames,
    createGame,
    getOpenGamesByCourses,
    updateGame,
    createResults,
    getGamesResultsByUser,
    getGameById
} = require('../controllers/gameController')

api.get("/", getGames)

api.get("/course", getOpenGamesByCourses)

api.get("/results/:id", getGamesResultsByUser)

api.get("/:id", getGameById)

api.post("/", createGame)

api.post("/results", createResults)

api.put("/", updateGame)

module.exports = api