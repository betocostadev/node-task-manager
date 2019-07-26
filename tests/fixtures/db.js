// This file will mock the DB operations and provide data to to other tests.
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
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

const setupDatabase = async () => {
  // Clean the users from the DB
  await User.deleteMany()
  // Await for the user to be created:
  await new User(userOne).save()
}

module.exports = {
  userOneId,
  userOne,
  setupDatabase
}