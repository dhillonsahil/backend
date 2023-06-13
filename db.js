const mongoose = require('mongoose')
const mongooseUrl = process.env.mongoUrl
const connectToMongo = () => {
    mongoose.connect(mongooseUrl,()=>{
        console.log("connected to mongo sucessfully")
    })
}

module.exports = connectToMongo;
