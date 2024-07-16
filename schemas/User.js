const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    firstName :{
        type: String,
        required : true
    },
    lastName: {
        type: String,
        required : true
    },
    username: {
        type: String,
        required : true,
        index : true,
        unique: true
        
    },
    email: {
        type: String,
        required : true,
        index : true,
        unique: true

    },
    password : {
        type: String,
        required: true,
    },
    token : String,
    phone : String
})

UserSchema.virtual('articles',{
    ref:'Article',
    localField : '_id',
    foreignField:'user_id'
})

module.exports = UserSchema