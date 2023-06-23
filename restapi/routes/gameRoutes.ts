import express, { Router } from 'express'
const api: Router = express.Router()

const {
    createGame,
    getOpenOrStartedGamesByCourses,
    updateState,
    createResults,
    getGamesByCourse,
    getGamesResultsByUser,
    getGameResultsByGame,
    getGameResultByUserAndGame,
    getGamesResultsByUserAndCourse,
    getGameById,
    deleteGame
} = require('../controllers/gameController')

api.get("/course", getOpenOrStartedGamesByCourses)

api.get("/user/results/:id", getGamesResultsByUser)

api.get("/results/:game_id", getGameResultsByGame)

api.get("/results/user/:user_id/game/:game_id", getGameResultByUserAndGame)

api.get("/results/user/:user_id/course/:course_id", getGamesResultsByUserAndCourse)

api.get("/course/:id", getGamesByCourse)

api.get("/:id", getGameById)

api.post("/", createGame)

api.post("/results", createResults)

api.put("/", updateState)

api.delete("/:id", deleteGame)

module.exports = api