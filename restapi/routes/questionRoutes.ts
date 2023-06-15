import express, { Router } from 'express'
const api: Router = express.Router()

const {
    getQuestions,
    createQuestion,
    getQuestionsByUser,
    exportQuestions,
    importQuestions,
    updateQuestion,
    getQuestionById,
    deleteQuestion,
    getQuestionsByCourse,
    deleteQuestionFromCourse
} = require('../controllers/questionController')

api.get("/", getQuestions)

api.get('/user/:id', [], getQuestionsByUser);

api.get('/:id', [], getQuestionById)

api.post("/", [

], createQuestion)

api.get("/export/:id", [], exportQuestions)

api.get('/courses/:id', getQuestionsByCourse)

api.post("/file/:id", importQuestions)

api.put("/", updateQuestion)

api.delete("/:id", deleteQuestion)

api.delete("/:question_id/course/:course_id", deleteQuestionFromCourse)

module.exports = api