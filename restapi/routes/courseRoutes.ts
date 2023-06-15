import express, { Router } from 'express'
const api: Router = express.Router()
const { check } = require('express-validator')

const {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    importCourses,
    addUsers,
    addSurveys,
    getCoursesByUser,
    addQuestions
} = require('../controllers/courseController')

api.get("/", getCourses)

api.get("/:id", [
    check('id').isLength({ min: 1 }).trim().escape(),
], getCourse)

api.get("/user/:id", getCoursesByUser)

api.post("/", [
    check('name').isLength({ min: 1 }).trim().escape(),
    check('description').isLength({ min: 1 }).trim().escape(),
], createCourse)

api.post("/file", importCourses)

api.post("/addUser", addUsers)

api.post("/addSurvey", addSurveys)

api.post("/addQuestion", addQuestions)

api.put("/", [
    check('name').isLength({ min: 1 }).trim().escape(),
], updateCourse)

api.delete("/:id", [
    check('id').isLength({ min: 1 }).trim().escape()
], deleteCourse)


module.exports = api