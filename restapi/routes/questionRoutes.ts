import express, { Router } from 'express'
const api: Router = express.Router()

const {
    getQuestions,
    createQuestion,
    getQuestionsByUser
} = require('../controllers/questionController')

api.get("/", getQuestions)

api.get('/:id', [], getQuestionsByUser);

api.post("/", [

], createQuestion)

module.exports = api