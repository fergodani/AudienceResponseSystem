import express, { Router } from 'express'
const api: Router = express.Router()

const {
    getQuestions
} = require('../controllers/questionController')

api.get("/", getQuestions)

module.exports = api