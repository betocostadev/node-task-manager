// MongoDB file created to explore how to perform CRUD operations
// Create Read Update Delete
// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID

// Using destructuring instead of the code above.
const { MongoClient, ObjectID } = require('mongodb')
// MongoDB object ID - It auto creates a GUID (Globally unique ID) but we are going to do something different just to check the ID:
const id = new ObjectID()
console.log(id)
// console.log(id.id)
console.log(id.getTimestamp())

const connectionUrl = 'mongodb://127.0.0.1:27017'
// database name, pick whatever you want
// Only by using a name an connecting to MongoDB like below, MongoDB already creates a DB for us.
const databaseName = 'task-manager'

MongoClient.connect(connectionUrl, { useNewUrlParser:true }, (error,client) => {
  if (error) {
    return console.log(`Unable to connect to ${databaseName} DB`, error)
  }
  console.log(`Connected to ${databaseName} DB. Running...`)
  // Creating a const to make it easier to manipulate the DB.
  const db = client.db(databaseName)

  // DB Operations READ:

  db.collection('users').findOne({name: 'Regina'}, (error, user) => {
    if (error) {
      return console.log(`Unable to fetch data.`)
      // If doesn't find a match, it will return null. Just providing a better log below;
    } else if (user === null) {
      return console.log(`No user found with the query provided.`)
    }
    console.log(user)
  })

  // Query using the ID:
  /* db.collection('users').findOne({_id: new ObjectID('5d23a3ea3c298b1f6e6e528f')}, (error, user) => {
    if (error) {
      return console.log(`Unable to fetch data.`)
    } else if (user === null) {
      return console.log(`No user found with the query provided.`)
    }
    console.log(user)
  })

  db.collection('tasks').find({ completed: false }).toArray((error, tasks) => {
    console.log(tasks)
  }) */

  // Using .count() will return only the number of documents that match the query
  /* db.collection('tasks').find({ completed: false }).count((error, tasks) => {
    console.log(tasks)
  }) */


  // DB Operations UPDATE:
  // Update One
  /* const updatePromise = db.collection('users').updateOne({
    _id: new ObjectID("5d23b0170934d6277439699f")
  }, {
    $set: {
      name: 'Joilson',
      age: 29
    }
  })

  updatePromise.then((result) => {
    console.log(result)
  }).catch((error) => {
    console.log(error)
  }) */

  // The code below will do the same as the Code above, but it's a simpler and more used pattern.
  // db.collection('users').updateOne({
  //   _id: new ObjectID('5d23b0170934d6277439699f')
  // }, {
  //   // $set is a mongodb pattern, like, inc and many others.
  //   $set: { age: 40 }
  // }).then((result) => {
  //   console.log(`Matched: ${result.matchedCount}. Modified: ${result.modifiedCount}`)
  // }).catch((error) => {
  //   console.log(error)
  // })

  // UPDATE MANY
  // db.collection('tasks').updateMany({
  //   completed: true
  // }, {
  //   $set: { completed: false }
  // }).then((result) => {
  //   console.log(`Matched: ${result.matchedCount}. Modified: ${result.modifiedCount}`)
  // }).catch((err) => {
  //   console.log(err)
  // })

  // DB Operations DELETE:
  // Delete One
  /* db.collection('users').deleteOne(
    {name: 'Betão'}
  , (error, result) => {
      if (error) {
        return console.log(error)
      }
      console.log(result.deletedCount)
  }) */

  // Delete One using the ObjectID
  // db.collection('tasks').deleteOne({
  //   _id: new ObjectID('5d23ab82a0123024006881b7')
  // }).then((result) => {
  //   console.log(`Deleted ${result.deletedCount} document.`)
  // }).catch((err) => {
  //   console.log(err)
  // })

  // Delete Many
  // db.collection('users').deleteMany({
  //   age: 43
  // }).then((result) => {
  //   console.log(`Documents deleted: ${result.deletedCount}`)
  // }).catch((err) => {
  //   console.log(err)
  // })

  // Delete Many, using more than one filter
  // db.collection('users').deleteMany({
  //   age: 42,
  //   age: 43
  // }).then((result) => {
  //   console.log(`Documents deleted: ${result.deletedCount}`)
  // }).catch((err) => {
  //   console.log(err)
  // })

})

