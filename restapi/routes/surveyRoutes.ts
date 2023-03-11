import express, { Router } from 'express'
const api: Router = express.Router()

const {
    getSurveys,
    createSurvey,
    getSurveysByUser
} = require('../controllers/surveyController')

api.get("/", getSurveys)

api.get("/:id", getSurveysByUser)

api.post("/", createSurvey);

module.exports = api