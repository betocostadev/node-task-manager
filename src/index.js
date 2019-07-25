// Initialization
// Not initializing here anymore. Due to testing, initializing the app from app.js

const app = require('./app')
// process... the used port for Heroku
const port = process.env.PORT // Port || removed, now in a config file.

app.listen(port, () => {
  console.log(`Server is up on port: ${port}`)
})

