const mongoose = require('mongoose')
const mongooseUrl = "mongodb://localhost:27017/takemynote"
const connectToMongo = () => {
    mongoose.connect(mongooseUrl,()=>{
        console.log("connected to mongo sucessfully")
    })
}

module.exports = connectToMongo;