const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, 'thisismynewcourse')
    // Find the correct user and check if the token is part of the tokens array
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
    if (!user) {
      throw new Error()
    }
    req.token = token // giving back the token to be able to logout the user
    // If it pass the above, then give access to the user, avoiding to run the login again
    req.user = user
    // console.log(token)
  } catch (error) {
    res.status(401).send({ error: 'Please login.' })
  }
  next()
}

module.exports = auth