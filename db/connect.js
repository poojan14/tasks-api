const mongoose = require('mongoose')
const connectDB = (url) => {
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
}

module.exports = connectDB





