// Created to use with supertest while not breaking index.js
// Initialization
const express = require('express')
// Require mongoose
require('./db/mongoose')
// Require routes
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()

app.use(express.json())
// Use Routes
app.use(userRouter)
app.use(taskRouter)

// Removed listen for testing on test file
module.exports = app

