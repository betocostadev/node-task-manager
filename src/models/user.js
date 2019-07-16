// User model for creating new users for the app
// Add validator to check for some fields
const validator = require('validator')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// Using a Schema to be able to use mongoose middleware

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
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

// Use the advantage of the middleware. Set the middleware.
// Needs to be an standard function due to 'this' binding
userSchema.pre('save', async function (next) {
  const user = this;
  // console.log('just before saving!')
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User