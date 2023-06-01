import express, { Router } from 'express'
const api: Router = express.Router()

const {
    getGames,
    createGame,
    getOpenOrStartedGamesByCourses,
    updateGame,
    createResults,
    getGamesResultsByUser,
    getGameById,
    deleteGame
} = require('../controllers/gameController')

api.get("/", getGames)

api.get("/course", getOpenOrStartedGamesByCourses)

api.get("/results/:id", getGamesResultsByUser)

api.get("/:id", getGameById)

api.post("/", createGame)

api.post("/results", createResults)

api.put("/", updateGame)

api.delete("/:id", deleteGame)

module.exports = api