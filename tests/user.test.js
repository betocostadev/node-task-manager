const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

/* Why it is important to use an empty collection on the DB to do the tests?
Because, when we run a function, like the 'Signup new user' below, a new instance will be created on the database.
A second one will fail to be created because it will have the same e-mail.
JEST provides ways to clean up the DB after or before testing to make sure it will all work correctly.
*/

// Delete all users before running the next test - No using it anymore.
// Now using the version from the fixtures/db.js file
/* beforeEach(async () => {
  await User.deleteMany()
  // Await for the user to be created:
  await new User(userOne).save()
}) */
beforeEach(setupDatabase)

test('Signup a new user', async () => {
  const response = await request(app).post('/users').send({
    name: 'Kundarius',
    email: 'kundarius@example.com',
    password: 'CumILEia10!'
  }).expect(201)
  // Why using a variable for what we are expecting? To get a response body, then we could:
  // Assert that the DB was changed correctly. Example:
  const user = await User.findById(response.body.user._id)
  // Since the user was created and we got its ID, we expect that the 'user' is not NULL
  expect(user).not.toBeNull()

  // Assert that the user password was correctly changed, not a plain text.
  expect(user.password).not.toBe('CumILEia10!')
  // Assertions about the response - Many object properties and values at the same time
  expect(response.body).toMatchObject({
    user: {
      name: 'Kundarius',
      email: 'kundarius@example.com',
    },
    token: user.tokens[0].token
  })
})

test('Login existing user', async () => {
  // Use the response body to validate the correct user is logged in
  const response = await request(app).post('/users/login').send({
    email: userOne.email,
    password: userOne.password
  }).expect(200)
  const user = await User.findById(response.body.user._id)
  expect(user.tokens.length).toBe(2) // Check that has the 2 tokens
  expect(response.body.token).toBe(user.tokens[1].token) // Check that the current token is the new token
})

test('DONT login nonexistent user', async () => {
  await request(app).post('/users/login').send({
    email: 'noman@nowhere.com',
    password: 'aSimplePass!'
  }).expect(400) // Expect 400 - Bad request
})

test('Get user profile', async () => {
  await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200)
})

test('DONT get profile for NOT logged user', async () => {
  await request(app).get('/users/me').send().expect(401)
})

test('Delete the user account', async () => {
  // Also, check if the user was deleted by looking for it after deleting
  await request(app).delete('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200)
  const user = await User.findById(userOneId)
  expect(user).toBeNull()

})

test('DONT delete account for NOT logged user', async () => {
  await request(app).delete('/users/me')
      .send()
      .expect(401)
})

test('Upload avatar image', async () => {
  await request(app).post('/users/me/avatar')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .attach('avatar', 'tests/fixtures/profile-01.jpeg')
      .expect(200)
  const user = await User.findById(userOneId)
  // Using .toEqual() - It users an algorithm to compare objects
  expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Update user profile fields', async () => {
  await request(app).patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: 'Odin'
    })
    .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toBe('Odin')
})

test('DONT Update user INVALID profile fields', async () => {
  await request(app).patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: 'Asgard'
    })
    .expect(400)
})