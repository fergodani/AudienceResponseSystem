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
    uploadUserFile
} = require('../controllers/userController')

api.get("/", getUsers)

api.get("/:id", [
    check('id').isLength( { min: 1 }).trim().escape(),
], getUser)

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

api.delete("/:id", [
    check('id').isLength({ min: 1 }).trim().escape()
], deleteUser)

module.exports = api