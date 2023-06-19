import express, { Router } from 'express'
const api: Router = express.Router()

const {
    createGame,
    getOpenOrStartedGamesByCourses,
    updateState,
    createResults,
    getGamesResultsByUser,
    getGamesResultsByUserAndCourse,
    getGameById,
    deleteGame
} = require('../controllers/gameController')

api.get("/course", getOpenOrStartedGamesByCourses)

api.get("/results/:id", getGamesResultsByUser)

api.get("/results/:user_id/:course_id", getGamesResultsByUserAndCourse)

api.get("/:id", getGameById)

api.post("/", createGame)

api.post("/results", createResults)

api.put("/", updateState)

api.delete("/:id", deleteGame)

module.exports = api