const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

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