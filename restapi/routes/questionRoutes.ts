import express, { Router } from 'express'
const api: Router = express.Router()

const {
    getQuestions,
    createQuestion
} = require('../controllers/questionController')

api.get("/", getQuestions)

api.post("/", [

], createQuestion)

module.exports = api