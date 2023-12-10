const app = require('./app')
const { connect } = require('mongoose');
const {DB_MONGO_USER,
  DB_MONGO_PASSWORD,
  DB_MONGO_HOST,
  DB_MONGO_DATABASE} = require("./constans/env");


const MONGODB_URI = `mongodb+srv://${DB_MONGO_USER}:${DB_MONGO_PASSWORD}@${DB_MONGO_HOST}/${DB_MONGO_DATABASE}`;


connect(MONGODB_URI)
    .then(()=>{
      app.listen(3000);
      console.log('Database connection successful')
    })
    .catch(error => {
      console.log(error.message);
      process.exit(1)
    });
