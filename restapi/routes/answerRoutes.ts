import express, { Router } from 'express'
const api: Router = express.Router()

const {
    getAnswers
} = require('../controllers/answerController')

api.get("/", getAnswers)

module.exports = api