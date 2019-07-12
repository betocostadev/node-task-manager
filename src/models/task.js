// User model for creating new users for the app
const mongoose = require('mongoose')

const Task = mongoose.model('Task',{
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  completed: {
    type: Boolean,
    default: false
  }
})

module.exports = Task