import express, { Router } from 'express'
const api: Router = express.Router()
const { check } = require('express-validator')

const {
    getUsers,
    login,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/userController')

api.get("/", getUsers)

api.post("/login", [
    check('username').isLength({ min: 1 }).trim().escape(),
    check('password').isLength({ min: 1 }).trim().escape(),
], login)

api.post("/create", [
    check('username').isLength({ min: 1 }).trim().escape(),
    check('password').isLength({ min: 1 }).trim().escape(),
    check('role').isLength({ min: 1 }).trim().escape(),
], createUser)

api.put("/", [
    check('username').isLength({ min: 1 }).trim().escape(),
], updateUser)

api.delete("/", [
    check('username').isLength({ min: 1 }).trim().escape()
], deleteUser)

module.exports = api