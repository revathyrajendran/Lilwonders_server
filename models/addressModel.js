const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
      customername:{
        type:String,
        required:true
      },
      buildingname:{
        type:String,
        required:true
      },
      locality:{
        type:String,
        required:true
      },
      pincode:{
        type:String,
        required:true
      },
      phonenumber:{
        type:String,
        required:true
      },
      alternatenumber:{
        type:String,
        required:true
      },
      addresstype:{
        type:String,
        required:true
      },
      //unique
       productcode:{
         type:String,
        required:true
      },
      usermail:{
        type:String,
        required:true
      },
      orderstatus:{
        type:String,
        required:true,
        default:'sold'

      }
      
})

const addresses = mongoose.model("addresses",addressSchema)
module.exports = addresses 