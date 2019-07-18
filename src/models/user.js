// User model for creating new users for the app
// Add validator to check for some fields
const validator = require('validator')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task') // Used to remove all tasks when user is removed

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
    // adding minlength: 16 here was breaking the app after implementing the token!
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
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
})

/* Since the tasks are going to their own collection inside the DB, we are not going to
create a tasks array inside the user model.
Here we will use a virtual property - A relationship between two entities. */
userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id', // The relation of the other field with this (owner with user ID)
  foreignField: 'owner' // The name of the field on the other collection to have the relation
})


// Methods are accessed by a single instance | Model methods, instance methods
// Get user profile - Hide sensitive data
userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject() //Mongoose method
  delete userObject.password
  delete userObject.tokens

  return userObject
}

// Use a method created for the schema to add the token
userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')

  user.tokens = user.tokens.concat({ token })
  // Lines below are breaking the app
  await user.save()
  // Lines above

  return token
}

// Static methods are accessed on the model
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error('Unable to login!')
  }
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new Error('Unable to login!')
  }

  return user
}

// Use the advantage of the middleware. Set the middleware.
// Needs to be an standard function due to 'this' binding
// Hash the plain text password:
userSchema.pre('save', async function (next) {
  const user = this;
  // console.log('just before saving!')
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

// Delete user tasks when the user is removed to avoid to keep a delete user tasks on the DB.
// Could be done by code to delete on the user model, but we will use the middleware approach.
userSchema.pre('remove', async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id })

  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User