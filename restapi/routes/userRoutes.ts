import express, { Router } from 'express'
const api: Router = express.Router()

const {
    getUsers
} = require('../controllers/userController')

api.get("/", getUsers)

module.exports = api