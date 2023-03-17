import express, { Router } from 'express'
const api: Router = express.Router()

const {
    getGames,
    createGame,
    getOpenGamesByCourses
} = require('../controllers/gameController')

api.get("/", getGames)

api.get("/course", getOpenGamesByCourses)

api.post("/", createGame)

module.exports = api