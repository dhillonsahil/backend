import mongoose, { Schema } from "mongoose";
const {schema} = mongoose;

const NotesSchema = new Schema({
    title : {
        required: true,
        type : String
    },
    description : {
        required: true,
        type : String
    },
    tag : {
        type : String,
        default: "General"
    },
    date : {
        type : Date,
        default : Date.now
    },
})

module.exports = mongoose.model('notes',NotesSchema) // model name , schema we created