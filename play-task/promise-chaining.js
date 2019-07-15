require('../src/db/mongoose')
const User = require('../src/models/user')

// A function to change the user's age, then check for all other users with the same age

// User ID: 5d28e17e3a1eb032560eddf9

/* User.findByIdAndUpdate('5d28e17e3a1eb032560eddf9', {age: 21
}).then((user) => {
  console.log(user)
  // return User.countDocuments({ age: 22 })
  return User.findById('5d29049657590713262a35fd')
}).then((updated) => {
  console.log(updated) // Will log the user with the new age
  return User.countDocuments({ age: 18 }) // will count the documents
}).then((result) => {
  console.log(result) // will log the number of documents
}).catch((err) => {
  console.log(err)
}) */

// Changing to async functions
// Only difference of the one that Andrew did is that this one will also return the
// updated user.
const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, { age })
  const count = await User.countDocuments({ age })
  const updatedUser = await User.findById(id)
  return { updatedUser, count}
}
updateAgeAndCount('5d28e17e3a1eb032560eddf9', 30).then((result) => {
  console.log(result)
}).catch((err) => {
  console.log(err)
})