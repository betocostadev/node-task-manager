// App function, used as a middleware => new request -> do something -> run route handler
// On user router you can see how it was done to use the middleware for a single route.

/* app.use((req, res, next) => {
  // console.log(req.method, req.path)
  if (req.method === 'GET') {
    res.send('GET requests are disabled')
  } else {
    next()
  }
}) */

// MAINTENANCE function
app.use((req, res, next) => {
  const maintenance = false
  if (maintenance) {
    res.status(503).send(`Sorry, we are currently under maintenance, we will be back soon!`)
  } else {
    next()
  }
})