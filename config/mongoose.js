const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/codel_development');

const db = mongoose.connection;

db.on('error',console.error.bind(console,"Error connecting to database"));

db.once('open',function(){
    console.log("Connected to the database mongodb");
})

module.exports = db;
