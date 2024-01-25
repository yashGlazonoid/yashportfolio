const mongoose = require('mongoose');

function connectToMongoDB(url){
    mongoose.connect(url)
    .then(()=>console.log("Mongo db connected"));
}

module.exports = connectToMongoDB;