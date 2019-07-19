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
// Use queries... /tasks?completed=true
// limit and skip... /tasks?completed=true&limit=5&skip=5 /first set of 5, then second set of 5
// /tasks/?sortBy=createdAt_asc | createdAt_desc = Ascending or descending order.
router.get('/tasks', auth, async (req, res) => {
  const match = {}
  const sort = {}
  if (req.query.completed) {
    match.completed = req.query.completed === 'true'
  }
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split('_') // convert to array ['createdAt', 'asc']
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1 //  returns {createdAt: x} 1 asc, -1 desc
  }
  try {
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    }).execPopulate()
    res.send(req.user.tasks)
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