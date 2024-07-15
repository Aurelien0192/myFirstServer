const mongoose = require('mongoose')

const ArticleSchema = mongoose.Schema({
    name :{
        type: String,
        required : true
    },
    user_id: {
        type:mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    description: {
        type: String,
        required : true
    },
    price: {
        type: Number,
        required : true
        
    },
    quantity: {
        type: Number,
        required : true,
    },
    created_at:{
        type : Date,
        required : true
    },
    updated_at: {
        type: Date
    }
})

module.exports = ArticleSchema