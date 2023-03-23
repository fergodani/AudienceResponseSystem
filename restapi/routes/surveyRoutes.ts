import express, { Router } from 'express'
const api: Router = express.Router()

const {
    getSurveys,
    createSurvey,
    getSurveysByUser,
    getSurveysByCourse
} = require('../controllers/surveyController')

api.get("/", getSurveys)

api.get("/:id", getSurveysByUser)

api.get("/courses/:id", getSurveysByCourse)

api.post("/", createSurvey);

module.exports = api