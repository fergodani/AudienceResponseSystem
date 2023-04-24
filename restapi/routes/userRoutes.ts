import express, { Router } from 'express'
const api: Router = express.Router()
const { check } = require('express-validator')

const {
    getUsers,
    getUser,
    login,
    createUser,
    updateUser,
    deleteUser,
    uploadUserFile,
    getUsersByCourse,
    changePassword,
    deleteUserFromCourse
} = require('../controllers/userController')

api.get("/", getUsers)

api.get("/:id", [
    check('id').isLength( { min: 1 }).trim().escape(),
], getUser)

api.get("/courses/:id", getUsersByCourse)

api.post("/login", [
    check('username').isLength({ min: 1 }).trim().escape(),
    check('password').isLength({ min: 1 }).trim().escape(),
], login)

api.post("/create", [
    check('username').isLength({ min: 1 }).trim().escape(),
    check('password').isLength({ min: 1 }).trim().escape(),
    check('role').isLength({ min: 1 }).trim().escape(),
], createUser)

api.post("/file", uploadUserFile)

api.put("/", [
    check('id').isLength({ min: 1 }).trim().escape(),
], updateUser)

api.put("/password/:id", changePassword)

api.delete("/:id", [
    check('id').isLength({ min: 1 }).trim().escape()
], deleteUser)

api.delete("/:user_id/course/:course_id", deleteUserFromCourse)

module.exports = api