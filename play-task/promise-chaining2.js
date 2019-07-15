require('../src/db/mongoose')
const Task = require('../src/models/task')

/* Task.findByIdAndRemove('5d2c92eed04b731606a0271c').then((task) => {
  console.log(task)
  return Task.countDocuments({ completed: false })
}).then((remaining) => {
  console.log(`Remaining incompleted tasks: ${remaining}`)
}).catch((err) => {
  console.log(err)
}) */

const deleteTaskAndCount = async (id, {completed}) => {
  const task = await Task.findByIdAndRemove(id)
  const otherTasks = await Task.countDocuments({completed})
  return { task, otherTasks}
}

deleteTaskAndCount('5d2cfad186bd2a18a49901a6', {completed: true}).then((result) => {
  console.log(result)
}).catch((err) => {
  console.log(err)
})