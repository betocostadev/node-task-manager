// We will use Mongoose to connect with MongoDB
const mongoose = require('mongoose')
const connectionURL = 'mongodb://127.0.0.1:27017/task-manager-api' // /taks-manager-api = db
mongoose.connect(connectionURL, {useNewUrlParser: true}, {useCreateIndex: true})


/* const addTask = new Task({ description: '  Use the other methods of Mongoose '})

addTask.save().then(() => {
  console.log(addTask)
}).catch((err) => {
  console.log(`Error!`, err)
}) */

// Using Find:
/* Task.find(function (err, task) {
  if (err) return console.error(err);
  console.log(task);
}) */