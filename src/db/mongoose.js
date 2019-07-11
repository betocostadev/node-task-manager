// We will use Mongoose
const mongoose = require('mongoose');
// The difference with mongoose is that we provide the DB name with the URL like below:
const connectionURL = 'mongodb://127.0.0.1:27017/task-manager-api' // /taks-manager-api = db
// useCreateIndex = Makes sure that indexes are created
mongoose.connect(connectionURL, {useNewUrlParser: true}, {useCreateIndex: true});

// Creating a model:
const User = mongoose.model('User', {
  name: {
    type: String
  },
  age: {
    type: Number
  }
})

const beto = new User({ name: 'Beto', age: 33 });
const andrew = new User({ name: 'Andrew', age: 29 });

// Now, to save to the DB:
andrew.save().then(() => {
  console.log(andrew)
}).catch((err) => {
  console.log(`Error!`, err)
})