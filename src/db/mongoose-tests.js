// We will use Mongoose
// Add validator to check for some fields
const validator = require('validator')
const mongoose = require('mongoose')
// The difference with mongoose is that we provide the DB name with the URL like below:
const connectionURL = 'mongodb://127.0.0.1:27017/task-manager-api' // /taks-manager-api = db
// useCreateIndex = Makes sure that indexes are created
mongoose.connect(connectionURL, {useNewUrlParser: true}, {useCreateIndex: true});

// Creating a model:
// Data Sanitization - Making sure we get the correct data, like:
// User age must be 18 or more, or a string must not contain empty spaces
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
    // trim will remove any spaces and lowercase will convert to lowercase.
    trim: true,
    lowercase: true,
    // Custom validator using the validator module
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error(`The provided e-mail is invalid`)
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    maxlength: 16,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error(`Your password constains the word "password", this is not allowed!`)
      }
    }
  },
  age: {
    type: Number,
    // min: 18,
    // Creating a custom validator!
    default: 18,
    validate(value) {
      if (value < 0) {
        throw new Error(`Age must be a positive number!`)
      }
    }
  }
})

// Creating a User based on the model
const addUser = new User({
  name: 'Jurema',
  email: 'gatinha19@hotmail.com',
  password: 'sixChars!',
  age: 20
})

// Saving the user to the database
/* addUser.save().then(() => {
  console.log(addUser)
}).catch((err) => {
  console.log(`Error!`, err)
})
 */

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

const addTask = new Task({ description: '  Use the other methods of Mongoose '})

addTask.save().then(() => {
  console.log(addTask)
}).catch((err) => {
  console.log(`Error!`, err)
})

// Using Find:
/* Task.find(function (err, task) {
  if (err) return console.error(err);
  console.log(task);
}) */

