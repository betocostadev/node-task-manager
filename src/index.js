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

// GET a task by it's ID
app.get('/tasks/:id', (req, res) => {
  const _id = req.params.id
  Task.findById(_id).then((task) => {
    if (!task) {
      return res.status(404).send()
    }
    res.send(task)
  }).catch((err) => {
    res.status(500).send(err)
  })
})

// GET all tasks from MongoDB
app.get('/tasks', (req, res) => {
  Task.find({}).then((tasks) => {
    res.send(tasks)
  }).catch((err) => {
    res.status(500).send(err)
  })
})

// POST new tasks to MongoDB
app.post('/tasks', (req, res) => {
  const task = new Task(req.body)

  task.save().then(() => {
    // Send a better status (201 = Created)
    res.status(201).send(task)
  }).catch((err) => {
    res.status(400).send(err)
  })
})

// GET all users from MongoDB
app.get('/users', (req, res) => {
  User.find({}).then((users) => {
    res.send(users)
  }).catch((err) => {
    res.status(500).send(err)
  })
})

// GET one user by ID
// The ID will be dynamic upon each request. Express gives us a good use for this just by
// using like below /:name of the field you want.
app.get('/users/:id', (req, res) => {
  // console.log(req.params)
  const _id = req.params.id
  User.findById(_id).then((user) => {
    if (!user) {
      return res.status(404).send()
    }
    res.send(user)
  }).catch((err) => {
    res.status(500).send(err)
  })
})

// POST new users to MongoDB
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

