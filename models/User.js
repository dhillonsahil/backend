import mongoose, { Schema } from "mongoose";
const {schema} = mongoose;

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

module.exports = mongoose.model('user',UserSchema) // model name , schema we created