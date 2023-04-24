import express, { Router } from 'express'
const api: Router = express.Router()

const {
    getSurveys,
    createSurvey,
    getSurveysByUser,
    getSurveysByCourse,
    getSurveysById,
    updateSurvey,
    deleteSurvey,
    deleteSurveyFromCourse
} = require('../controllers/surveyController')

api.get("/", getSurveys)

api.get("/user/:id", getSurveysByUser)

api.get("/:id", getSurveysById)

api.get("/courses/:id", getSurveysByCourse)

api.post("/", createSurvey);

api.put("/", [], updateSurvey)

api.delete("/:id", deleteSurvey)

api.delete("/:survey_id/course/:course_id", deleteSurveyFromCourse)

module.exports = api