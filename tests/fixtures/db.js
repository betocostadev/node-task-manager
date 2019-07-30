// This file will mock the DB operations and provide data to to other tests.
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')
// A user that will be created before using beforeEach to delete the users.
// Doing this to test a function like Login
const userOneId = new mongoose.Types.ObjectId()
const userOne = {
  _id: userOneId,
  name: 'Thor',
  email: 'mjolnir@asgard.org',
  password: 'todrinkANDsmash!',
  age: 4200,
  tokens: [{
    token: jwt.sign({ _id: userOneId}, process.env.JWT_CODE)
  }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
  _id: userTwoId,
  name: 'Loki',
  email: 'lokithebest@asgard.org',
  password: 'MakeYouAFool!',
  age: 5000,
  tokens: [{
    token: jwt.sign({ _id: userTwoId}, process.env.JWT_CODE)
  }]
}

// Create a new task from here
const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: 'My first task',
  completed: true,
  owner: userOneId
}

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: 'My second task',
  completed: false,
  owner: userOneId
}

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Go to Earth',
  completed: true,
  owner: userTwo._id
}

const taskFour = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Thors third task',
  completed: true,
  owner: userOneId
}

const taskFive = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Thors fourth task',
  completed: false,
  owner: userOneId
}

const setupDatabase = async () => {
  // Clean the users and tasks from the DB
  await User.deleteMany()
  await Task.deleteMany()
  // Await for the user to be created:
  await new User(userOne).save()
  await new User(userTwo).save()
  await new Task(taskOne).save()
  await new Task(taskTwo).save()
  await new Task(taskThree).save()
  await new Task(taskFour).save()
  await new Task(taskFive).save()
}

module.exports = {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  taskFour,
  taskFive,
  setupDatabase
}