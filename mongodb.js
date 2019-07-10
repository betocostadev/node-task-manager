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

  // DB Operations CREATE:
  // Create a collection (like creating a table on SQL dbs) and already insert one.
  // Insert One
  /* db.collection('users').insertOne({
    name: 'Beto',
    age: 33
    // Below we will use a callback with our code to know if it worked or not.
  }, (error, result) => {
    if (error) {
      return console.log(`Unable to insert user`)
    }
    console.log(result.ops)
  }) */

  // Insert One - BUT - Now using the ID we created above
  /* db.collection('users').insertOne({
    // Since ID is auto generated, we don't need to provide one.
    // We are just providing it to check the one we created above.
    _id: id,
    name: 'James',
    age: 36
  }, (error, result) => {
    if (error) {
      return console.log(`Unable to insert user`)
    }
    console.log(result.ops)
  }) */

  // Insert Many
  /* db.collection('users').insertMany([
    { name: 'Betão', age: 64},
    { name: 'Adriene', age: 65}
  ], (error, result) => {
    if (error) {
      return console.log(`Could not insert many`)
    }
    console.log(result.ops)
  }) */

  // Insert Many - Again - Challenge
  /* db.collection('tasks').insertMany([
    {description: 'Gym', completed: false},
    {description: 'Codenation', completed: true},
    {description: 'Khan Math', completed: false}
  ],(error, result) => {
    if (error) {
      return console.log(`Failed to execute: Insert Many operation.`)
    }
    console.log(result.ops, result.insertedCount)
  }) */

  // DB Operations READ:

  db.collection('users').findOne({name: 'John'}, (error, user) => {
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
  // const updatePromise = db.collection('users').updateOne({
  //   _id: new ObjectID("5d23b0170934d6277439699f")
  // }, {
  //   $set: {
  //     name: 'Joilson',
  //     age: 29
  //   }
  // })

  // updatePromise.then((result) => {
  //   console.log(result)
  // }).catch((error) => {
  //   console.log(error)
  // })

  // The code below will do the same as the Code above, put is simpler and a more used pattern.
  db.collection('users').updateOne({
    _id: new ObjectID('5d23b0170934d6277439699f')
  }, {
    $set: { name: 'Cornholio'}
  }).then((result) => {
    console.log(`Matched: ${result.matchedCount}. Modified: ${result.modifiedCount}`)
  }).catch((error) => {
    console.log(error)
  })

  // Delete One
  /* db.collection('users').deleteOne(
    {name: 'Betão'}
  , (error, result) => {
      if (error) {
        return console.log(error)
      }
      console.log(result.deletedCount)
  }) */

  // Delete Many (Uses a filter, like age>50, weight == 30, etc)
  /* db.collection('users').deleteMany({ 50},
    (error, result) => {
      if (error) {
        return console.log(error)
      }
      console.log(result.deletedCount)
    })
     */

})

