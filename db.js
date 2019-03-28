const mongoose = require('mongoose');//define where to connect the database

mongoose.connect('mongodb://localhost/gps', {
  useNewUrlParser: true
});

// successful connection
mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open');
});
mongoose.connection.on('error', function (err) {
  if (err) {
    return console.error(err);
  }
});