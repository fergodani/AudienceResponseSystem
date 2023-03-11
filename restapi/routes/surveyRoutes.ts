import express, { Router } from 'express'
const api: Router = express.Router()

const {
    getSurveys,
    createSurvey
} = require('../controllers/surveyController')

api.get("/", getSurveys)

api.post("/", createSurvey);

module.exports = api