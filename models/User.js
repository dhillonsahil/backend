const mongoose = require('mongoose')
const { Schema } = mongoose;

const UserSchema = new Schema({
    name : {
        required: true,
        type : String
    },
    email : {
        required: true,
        type : String,
        unique : true
    },
    password : {
        required: true,
        type : String
    },
    date : {
        type : Date,
        default : Date.now
    },
})
const User  = mongoose.model('user',UserSchema) // model name , schema we created
User.createIndexes();
module.exports = User;