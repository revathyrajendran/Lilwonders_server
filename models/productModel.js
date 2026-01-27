const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name :{
        type:String,
        required:true
    },
    //everyproduct is unique, name can repeate, brand can repeate but not code
    productcode :{
        type:String,
        required:true,
        
    },
    brand :{
        type:String,
        required:true
    },
     ageGroup :{
        type:String,
        required:true
    },
    color :{
        type:String,
        required:true
    },
    price :{
        type:String,
        required:true
    },
    discountPrice :{
        type:String,
        required:true
    },
    description :{
        type:String,
        required:true
    },
    //casual
    occasion :{
        type:String,
        required:true
    },
    //boy or girl
    idealFor :{
        type:String,
        required:true
    },
    fabrictype :{
        type:String,
        required:true
    },
    fabricCare:{
        type:String,
        required:true
    },
    uploadImg:{
        type:Array,
        required:true
    },
     //ordered or delivered
    status:{
        type:String,
        default:'unordered'
    },
    //purchase history of logged in user
    bought:{
        type:String,
       default:''
    }
    

})

const products = mongoose.model("products",productSchema)
module.exports = products