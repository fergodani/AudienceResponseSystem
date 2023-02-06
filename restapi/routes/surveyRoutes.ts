import express, { Router } from 'express'
const api: Router = express.Router()

const {
    getSurveys
} = require('../controllers/surveyController')

api.get("/", getSurveys)

module.exports = api