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
app.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id
  try {
    const task = await Task.findById(_id)

    if (!task) {
      return res.status(404).send()
    }
    res.send(task)

  } catch (error) {
    res.status(500).send(err)
  }
})

// GET all tasks from MongoDB
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({})
    res.send(tasks)
  } catch (error) {
    res.status(500).send(err)
  }
})

// PATCH - Update the task
app.patch('/tasks/:id', async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']
  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidUpdate) {
    return res.status(400).send({error: 'Invalid update field!'})
  }

  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
    if (!task) {
      return res.status(404).send()
    }
    res.send(task)
  } catch (error) {
    res.status(400).send(error)
  }
})

// POST new tasks to MongoDB
app.post('/tasks', async (req, res) => {
  const task = new Task(req.body)
  try {
    await task.save()
    res.status(201).send(task)
  } catch (error) {
    res.status(400).send(error)
  }
})

// GET all users from MongoDB
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({})
    res.send(users)
  } catch (error) {
    res.status(500).send(error)
  }
})

// GET one user by ID
// The ID will be dynamic upon each request. Express gives us a good use for this just by
// using like below /:name of the field you want.
app.get('/users/:id', async (req, res) => {
  // console.log(req.params)
  const _id = req.params.id
  try {
    const user = await User.findById(_id)
    if (!user) {
      return res.status(404).send
    }
    res.send(user)
  } catch (err) {
    res.status(500).send(err)
  }
})

// PATCH - Update an existing resource
app.patch('/users/:id', async (req, res) => {
  // If someone tries to update something that doesn't exist, it will do nothing, but
  // it will return a 200 code, an ok status. Using the array below to avoid this.
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({error: 'Invalid update field!'})
  }

  try {
    // req.body to use the data we pass on the req.body.
    // new: to pass as a new user before changing it / runValidators to validate the data
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
    if (!user) {
      return res.status(404).send()
    }
    res.send(user)
  } catch (error) {
    res.status(400).send(error)
  }
})

// POST new users to MongoDB
app.post('/users', async (req, res) => {
  const user = new User(req.body)
  // user.save().then(() => {
  //   res.send(user)
  // }).catch((err) => {
  //   res.status(400).send(err)
  // })
  // REFACTOR for async / await
  try {
    await user.save()
    res.status(201).send(user)
  } catch (err) {
    res.status(400).send(err)
  }
})

app.listen(port, () => {
  console.log(`Server is up on port: ${port}`)
})

