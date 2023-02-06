import express, { Router } from 'express'
const api: Router = express.Router()

const {
    getCourses
} = require('../controllers/courseController')

api.get("/", getCourses)

module.exports = api