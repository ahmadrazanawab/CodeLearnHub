const mongoose = require('mongoose');
const mongoUrl = "mongodb://127.0.0.1:27017/codelearnhub";

mongoose.set('strictQuery', false);
const ConnectToMongo = () => {
    mongoose.connect(mongoUrl,() => {
        console.log("Connected to Successfully");
    })
}

module.exports = ConnectToMongo;