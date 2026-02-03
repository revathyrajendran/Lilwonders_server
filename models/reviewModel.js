const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    customername:{
        type:String,
        required:true
    },
    stars:{
        type:String,
        required:true
    },
    //comments
    rating:{
        type:String,
        required:true
    },
    email:{
         type:String,
        required:true
    }

})

const reviews = mongoose.model("reviews",reviewSchema)
module.exports = reviews