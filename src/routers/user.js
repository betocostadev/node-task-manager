const express = require('express')
const User = require('../models/user') // Use the User Model for mongoose
const auth = require('../middleware/auth')// Use our Auth Middleware
const router = new express.Router()

// POST new users to MongoDB
router.post('/users', async (req, res) => {
  const user = new User(req.body)
  // user.save().then(() => {
  //   res.send(user)
  // }).catch((err) => {
  //   res.status(400).send(err)
  // })
  // REFACTOR for async / await
  try {
    const token = await user.generateAuthToken()
    await user.save()
    res.status(201).send({user, token})
  } catch (error) {
    res.status(400).send(error)
  }
})

// POST - Logging users by email and password
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    // Using 'user' because it will ge generated for a very specific user
    const token = await user.generateAuthToken()
    res.send({user, token})
  } catch (error) {
    res.status(400).send()
  }
})

// POST Logout users | Drop only one auth, to avoid disconnecting on other devices
router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.user.save()
    res.send()
  } catch (error) {
    res.status(500).send()
  }
})

// POST - Logout ALL - Will wipe all the tokens to logout from everywhere
router.post('/users/logoutall', auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.send()
  } catch (error) {
    res.status(500).send()
  }
})

// PATCH - Update an existing resource
router.patch('/users/:id', async (req, res) => {
  // If someone tries to update something that doesn't exist, it will do nothing, but
  // it will return a 200 code, an ok status. Using the array below to avoid this.
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({error: 'Invalid update field!'})
  }

  try {
    // req.body to use the data we pass on the req.body.
    // new: to pass as a new user before changing it / runValidators to validate the data
    const user = await User.findById(req.params.id)
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
    updates.forEach((update) => user[update] = req.body[update])

    await user.save()

    if (!user) {
      return res.status(404).send()
    }
    res.send(user)
  } catch (error) {
    res.status(400).send(error)
  }
})

// Get profile - Only the logged user
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
})


// GET all users from MongoDB (Changed the method calls from app.get() to router...)
// Function deactivated
/* router.get('/users/me', auth, async (req, res) => {
  try {
    const users = await User.find({})
    res.send(users)
  } catch (error) {
    res.status(500).send(error)
  }
}) */

// GET one user by ID
// The ID will be dynamic upon each request. Express gives us a good use for this just by
// using like below /:name of the field you want.
router.get('/users/:id', async (req, res) => {
  // console.log(req.params)
  const _id = req.params.id
  try {
    const user = await User.findById(_id)
    if (!user) {
      return res.status(404).send
    }
    res.send(user)
  } catch (err) {
    res.status(500).send(err)
  }
})

// DELETE a user by its ID
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      return res.status(404).send({error: 'User not found!'})
    }
    res.send(user)
  } catch (error) {
    res.status(500).send(error)
  }
})


module.exports = router