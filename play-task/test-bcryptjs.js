const bcrypt = require('bcryptjs')
const myFunction = async () => {
  // Create a password hash
  const password = 'Red12345!'
  const hashedPassword = await bcrypt.hash(password, 8)
  console.log(password)
  console.log(hashedPassword)

  // Hashed passwords cannot be decripted, instead, the plain text will be hashed again
  // then it will be compared to the hashed pass on the DB.
  const isMatch = await bcrypt.compare('Red12345!', hashedPassword)
  console.log(isMatch)
}

myFunction()