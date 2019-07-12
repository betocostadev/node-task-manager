// User model for creating new users for the app
// Add validator to check for some fields
const validator = require('validator')
const mongoose = require('mongoose')

const User = mongoose.model('User', {
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error(`The provided e-mail is invalid.`)
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    maxlength: 16,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error(`Your password constains the word "password", this is not allowed!`)
      }
    }
  },
  age: {
    type: Number,
    default: 18,
    validate(value) {
      if (value < 0) {
        throw new Error(`Age must be a positive number!`)
      }
    }
  }
})

module.exports = User