const mongoose = require('mongoose');

//database connection

const dbName = process.env.DB_NAME;
console.log(dbName);
const URI =
  'mongodb+srv://' +
  process.env.DB_USERNAME +
  ':' +
  process.env.DB_PASSWORD +
  '@ecommercemanagement.hrsp2.mongodb.net/<' +
  dbName +
  '>?retryWrites=true&w=majority';
console.log(URI);

mongoose.connect(
  URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (error, connected) {
    if (error) {
      console.log('Failed to connect with Message :', error);
    } else {
      console.log('Database Connection Success');
    }
  }
);
