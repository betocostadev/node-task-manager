const request = require('supertest')
const app = require('../src/app')
// Call the user model to be able to delete every user before testing
const User = require('../src/models/user')

/* Why it is important to use an empty collection on the DB to do the tests?
Because, when we run a function, like the 'Signup new user' below, a new instance will be created on the database.
A second one will fail to be created because it will have the same e-mail.
JEST provides ways to clean up the DB after or before testing to make sure it will all work correctly.
*/

// A user that will be created before using beforeEach to delete the users.
// Doing this to test a function like Login
const userOne = {
  name: 'Thor',
  email: 'mjolnir@asgard.org',
  password: 'todrinkANDsmash!',
  age: 4200
}

// Delete all users before running the next test
beforeEach(async () => {
  await User.deleteMany()
  // Await for the user to be created:
  await new User(userOne).save()
})

test('Signup a new user', async () => {
  await request(app).post('/users').send({
    name: 'Kundarius',
    email: 'kundarius@example.com',
    password: 'CumILEia10!'
  }).expect(201)
})

test('Login existing user', async () => {
  await request(app).post('/users/login').send({
    email: userOne.email,
    password: userOne.password
  }).expect(200)
})

test('Failed login for Nonexistent user', async () => {
  await request(app).post('/users/login').send({
    email: 'noman@nowhere.com',
    password: 'aSimplePass!'
  }).expect(400) // Expect 400 - Bad request
})