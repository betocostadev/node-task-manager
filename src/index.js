// Initialization
const express = require('express')
// Require mongoose
require('./db/mongoose')

// Require routes
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
// process... the used port for Heroku
const port = process.env.PORT || 3000

app.use(express.json())
// Use Routes
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
  console.log(`Server is up on port: ${port}`)
})

const bcrypt = require('bcryptjs')
const myFunction = async () => {
  const password = 'Red12345!'
  const hashedPassword = await bcrypt.hash(password, 8)

  console.log(password)
  console.log(hashedPassword)

  const isMatch = await bcrypt.compare('Red12345!', hashedPassword)
  console.log(isMatch)
}

myFunction()