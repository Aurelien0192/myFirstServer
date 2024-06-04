const { first } = require('lodash')
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
        required : true
    },
    email: {
        type: String,
        required : true
    },
    phone : String
})

module.exports = UserSchema