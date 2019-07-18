const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth') // Use to auth user and have its own tasks
const router = new express.Router()

// POST new tasks to MongoDB
router.post('/tasks', auth, async (req, res) => {
  // const task = new Task(req.body) // old solution
  const task = new Task({
    ...req.body, // spread req.body
    owner: req.user._id
  })
  try {
    await task.save()
    res.status(201).send(task)
  } catch (error) {
    res.status(400).send(error)
  }
})

// PATCH - Update the task
router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']
  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidUpdate) {
    return res.status(400).send({error: 'Invalid update field!'})
  }

  try {
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
    if (!task) {
      return res.status(404).send()
    }
    updates.forEach((update) => task[update] = req.body[update])
    await task.save()
    res.send(task)
  } catch (error) {
    res.status(400).send(error)
  }
})

// GET all tasks from MongoDB
router.get('/tasks', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user._id})
    res.send(tasks)
  } catch (error) {
    res.status(500).send(error)
  }
})

// GET a task by it's ID
router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id
  try {
    // Using the .execPopulate() method would also work
    const task = await Task.findOne({ _id, owner: req.user._id })
    if (!task) {
      return res.status(404).send()
    }
    res.send(task)

  } catch (error) {
    res.status(500).send(error)
  }
})

// DELETE the task
router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
    if (!task) {
      return res.status(404).send({error: 'Task not found'})
    }
    res.send(task)
  } catch (error) {
    res.status(500).send(error)
  }
})

module.exports = router