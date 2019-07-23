const jwt = require('jsonwebtoken')
const myFunction = async () => {
  // Needs to store a unique code for the user to be authenticated, the user id is nice
  // The second (string) is another unique value that makes sure it was not changed. A random
  // series of characters are enough
  // Third, object to customize the time to be authenticated
  // Can be writen in plain english, like '2 weeks', '1 month', '14 days', etc.
  // The code below 'thisismynewcourse' can be hidden in an enviroment variable
  const token = jwt.sign({_id: 'abc123'}, 'thisismynewcourse', { expiresIn: '7 days'})
  console.log(token)

  // Verify the token
  const data = jwt.verify(token, 'thisismynewcourse')
  console.log(data)
}

myFunction()