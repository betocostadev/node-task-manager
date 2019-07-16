const express = require('express')
const Task = require('../models/task')
const router = new express.Router()

// POST new tasks to MongoDB
router.post('/tasks', async (req, res) => {
  const task = new Task(req.body)
  try {
    await task.save()
    res.status(201).send(task)
  } catch (error) {
    res.status(400).send(error)
  }
})

// PATCH - Update the task
router.patch('/tasks/:id', async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']
  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidUpdate) {
    return res.status(400).send({error: 'Invalid update field!'})
  }

  try {
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

    const task = await Task.findById(req.params.id)
    updates.forEach((update) => task[update] = req.body[update])
    await task.save()

    if (!task) {
      return res.status(404).send()
    }
    res.send(task)
  } catch (error) {
    res.status(400).send(error)
  }
})

// GET all tasks from MongoDB
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({})
    res.send(tasks)
  } catch (error) {
    res.status(500).send(err)
  }
})

// GET a task by it's ID
router.get('/tasks/:id', async (req, res) => {
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

// DELETE the task
router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)
    if (!task) {
      return res.status(404).send({error: 'Task not found'})
    }
    res.send(task)
  } catch (error) {
    res.status(500).send(error)
  }
})

module.exports = router