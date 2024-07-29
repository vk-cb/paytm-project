const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name : {type: String, required:true},
    email : {type: String, required:true, unique: true},
    password : {type: String, required : true , minLength:6},
    wallet : {type : Number}
})

module.exports = mongoose.model("users", UserSchema)