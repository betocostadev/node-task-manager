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
  taskFour,
  taskFive,
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

test('CANT change task field other than description/completed', async () => {
  const response = await request(app)
    .patch(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: 'Asgard'
    })
    .expect(400)
})

test('Get user tasks only the owner', async () => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
    expect(response.body.length).toEqual(4)
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

test('User CANT update tasks from other users', async () => {
  const response = await request(app)
    .patch(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send({
      completed: false
    })
    .expect(404)
})

test('Delete User task', async () => {
  const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
    // Assert if the task was deleted
    const task = await Task.findById(taskOne._id)
    expect(task).toBeNull()
})

test('DONT delete task if unauthenticated', async () => {
  const response = await request(app)
    .delete(`/tasks/${taskTwo._id}`)
    .send()
    .expect(401)
    const task = await Task.findById(taskTwo._id)
    expect(task).not.toBeNull()
})

test('Fetch User task by ID', async () => {
  const response = await request(app)
    .get(`/tasks/${taskOne._id}`)
    .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
  // Assert if it returned the correct task
  const task = await Task.findById(taskOne._id)
  expect(response.body._id).toBe(task.id)
})

test('DONT fetch user task by ID IF Unauthenticated', async () => {
  const response = await request(app)
    .get(`/tasks/${taskOne._id}`)
    .send()
    .expect(401)
})

test('Fetch User task by ID', async () => {
  const response = await request(app)
    .get(`/tasks/${taskOne._id}`)
    .set(`Authorization`, `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)
  // Assert if it returned the empty object
  expect(response.body).toEqual({})
})

test('Fetch ONLY completed tasks', async() => {
  const response = await request(app)
    .get(`/tasks?completed=true`)
    .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Fetch ONLY incompleted tasks', async() => {
  const response = await request(app)
    .get(`/tasks?completed=false`)
    .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Fetch ALL tasks', async() => {
  const response = await request(app)
    .get(`/tasks/`)
    .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
  // User has 4 tasks, check if its the same
    expect(response.body.length).toBe(4)
})
