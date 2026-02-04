const addresses = require('../models/addressModel')

// add address
exports.addAddressByUSERController=async(req,res)=>{
          console.log("Inside addAddressByUSERController!!!!!!!!!!! ");
          //Now to add address details into database , we need to destructure the request body.
          const{customername,buildingname,locality,pincode,phonenumber,alternatenumber,addresstype,productcode, productname,productprice, productimg,orderstatus}=req.body
           //req payload comes from jwtMiddleware.
             const usermail = req.payload
             try{
                  const newAddress = new addresses({
                    customername,buildingname,locality,pincode,phonenumber,alternatenumber,addresstype,productcode,productname,productprice,productimg,orderstatus,usermail
                  })
                  await newAddress.save()
                   res.status(200).json(newAddress)

             }catch(err){
                res.status(500).json(err)
             }
   }

//get all oders are listed from addresses
exports.getAllOrdersForAdminController=async(req,res)=>{
  console.log("inside getAllOrdersForAdminController!");
  try{
    const allOrders = await addresses.find({orderstatus:{
      $in:['ordered','sold']
    }})
    res.status(200).json(allOrders)

  }catch(err){
    res.status(500).json(err)
  }
  
}

