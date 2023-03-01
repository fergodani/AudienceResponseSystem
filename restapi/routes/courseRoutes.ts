import express, { Router } from 'express'
const api: Router = express.Router()
const { check } = require('express-validator')

const {
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courseController')

api.get("/", getCourses)

api.post("/", [
    check('name').isLength({ min: 1 }).trim().escape(),
    check('description').isLength({ min: 1 }).trim().escape(),
], createCourse)

api.put("/", [
    check('name').isLength({ min: 1 }).trim().escape(),
], updateCourse)

api.delete("/:id", [
    check('id').isLength({ min: 1 }).trim().escape()
], deleteCourse)


module.exports = api