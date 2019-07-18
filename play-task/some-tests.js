// Testing Tasks
/* const Task = require('./models/task')
const User = require('./models/user')
const main = async () => {
  const task = await Task.findById('5d30a833b180aa16505f96f3')
  console.log(task.description, task.completed)
  const user = await User.findById(task.owner)
  console.log(user.name)
}
main() */
// Now, the same thing, but using the REF on the task model.
/* const Task = require('./models/task')
const main = async () => {
  const task = await Task.findById('5d30a833b180aa16505f96f3')
  await task.populate('owner').execPopulate()
  console.log(task.owner)
}
main() */

// The opposite, get the user and show it's tasks
const User = require('./models/user')
const main = async () => {
  const user = await User.findById('5d30a621c267ba14fb2e0d0b')
  await user.populate('tasks').execPopulate()
  console.log(user.tasks)
}
main()

// Using express .toJSON test
/* const pet = {
  name: 'Churchill'
}

pet.toJSON = function () {
  console.log(this)
  return this
}
console.log(JSON.stringify(pet)) */