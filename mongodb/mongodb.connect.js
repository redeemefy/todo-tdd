const mongoose = require('mongoose')

async function connect() {
  try {
    await mongoose.connect(
      'mongodb://gdiaz:test,.123@ds255539.mlab.com:55539/todo-tdd',
      { useNewUrlParser: true }
      )
  } catch (error) {
    console.error('Error connecting to database')
  }
}

module.exports = { connect }