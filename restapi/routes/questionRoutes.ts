import express, { Router } from 'express'
const api: Router = express.Router()

const {
    getQuestions,
    createQuestion,
    getQuestionsByUser,
    exportQuestions,
    importQuestions
} = require('../controllers/questionController')

api.get("/", getQuestions)

api.get('/:id', [], getQuestionsByUser);

api.post("/", [

], createQuestion)

api.get("/export/:id", [], exportQuestions)

api.post("/file/:id", importQuestions)

module.exports = api