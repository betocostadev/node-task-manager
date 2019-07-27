const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase
} = require('./fixtures/db')

/* Attention, now in package.json, for running jest it is not anymore:
"test-dev": "env-cmd -f ./config/test.env jest --watch"
It was changed to:
"test-dev": "env-cmd -f ./config/test.env jest --watch --runInBand"
This will make sure that JEST runs a single test file at a time to avoid conflicts */

beforeEach(setupDatabase)

test('Create a task for the user', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: 'See if this test is running'
    })
    .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    // Check if the task was added as not completed, as it should
    expect(task.completed).toBe(false)
})

test('DONT create a task if no description is provided', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(400)
    const task = await Task.findById(response.body._id)
    expect(task).toBeNull()
})

test('Get user tasks only the owner', async () => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
    expect(response.body.length).toEqual(2)
})

test('User CANT delete tasks from other users', async () => {
  const response = await request(app)
  .delete(`/tasks/${taskOne._id}`)
  .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
  .send()
  .expect(404)
  // Assert if the task is still on the DB
  const task = await Task.findById(taskOne._id)
  expect(task).not.toBeNull()
})



// TODO
// Task Test Ideas
//

// Should not update task with invalid description/completed
// Should delete user task
// Should not delete task if unauthenticated
// Should not update other users task
// Should fetch user task by id
// Should not fetch user task by id if unauthenticated
// Should not fetch other users task by id
// Should fetch only completed tasks
// Should fetch only incomplete tasks
// Should sort tasks by description/completed/createdAt/updatedAt
// Should fetch page of tasks