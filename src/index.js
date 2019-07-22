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

// multer example
const multer = require('multer')
// upload object with its options. Should be one for each kind of file like pdf, jpeg, etc.
const upload = multer({
  dest: 'images'
})
app.post('/upload', upload.single('upload'), (req, res) => {
  res.send()
})

app.use(express.json())
// Use Routes
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
  console.log(`Server is up on port: ${port}`)
})

