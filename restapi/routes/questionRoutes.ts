import express, { Router } from 'express'
const api: Router = express.Router()

const {
    getQuestions,
    createQuestion,
    getQuestionsByUser,
    exportQuestions,
    importQuestions,
    updateQuestion,
    getQuestionsById
} = require('../controllers/questionController')

api.get("/", getQuestions)

api.get('/user/:id', [], getQuestionsByUser);

api.get('/:id', [], getQuestionsById)

api.post("/", [

], createQuestion)

api.get("/export/:id", [], exportQuestions)

api.post("/file/:id", importQuestions)

api.put("/", updateQuestion)

module.exports = api