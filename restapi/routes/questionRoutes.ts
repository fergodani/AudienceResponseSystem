import express, { Router } from 'express'
const api: Router = express.Router()

const {
    getQuestions,
    createQuestion,
    getQuestionsByUser,
    exportQuestions,
    importQuestions,
    updateQuestion,
    getQuestionsById,
    deleteQuestion,
    getQuestionsByCourse
} = require('../controllers/questionController')

api.get("/", getQuestions)

api.get('/user/:id', [], getQuestionsByUser);

api.get('/:id', [], getQuestionsById)

api.post("/", [

], createQuestion)

api.get("/export/:id", [], exportQuestions)

api.get('/courses/:id', getQuestionsByCourse)

api.post("/file/:id", importQuestions)

api.put("/", updateQuestion)

api.delete("/:id", deleteQuestion)

module.exports = api