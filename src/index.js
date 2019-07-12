// Initialization
const express = require('express')
const app = express()
// Require mongoose
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

// process... the used port for Heroku
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/tasks', (req, res) => {
  const task = new Task(req.body)

  task.save().then(() => {
    // Send a better status (201 = Created)
    res.status(201).send(task)
  }).catch((err) => {
    res.status(400).send(err)
  })
})

app.post('/users', (req, res) => {
  const user = new User(req.body)

  user.save().then(() => {
    res.send(user)
  }).catch((err) => {
    res.status(400).send(err)
    // res.send(err)
  })
})

app.listen(port, () => {
  console.log(`Server is up on port: ${port}`)
})

