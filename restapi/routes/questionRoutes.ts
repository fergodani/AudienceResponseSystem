import express, { Router } from 'express'
const api: Router = express.Router()

const {
    getQuestions,
    createQuestion,
    getQuestionsByUser,
    exportQuestions
} = require('../controllers/questionController')

api.get("/", getQuestions)

api.get('/:id', [], getQuestionsByUser);

api.post("/", [

], createQuestion)

api.get("/export/:id", [], exportQuestions)

module.exports = api