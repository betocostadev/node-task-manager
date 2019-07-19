// User model for creating new users for the app
const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  completed: {
    type: Boolean,
    default: false
  }, // Set the owner, this will help us to create a relationship user and task
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // This creates a reference for User in the User model.
  }
}, {
  timestamps: true
})
const Task = mongoose.model('Task', taskSchema)

module.exports = Task