import express, { Router } from 'express'
const api: Router = express.Router()

const {
    getGames
} = require('../controllers/gameController')

api.get("/", getGames)

module.exports = api