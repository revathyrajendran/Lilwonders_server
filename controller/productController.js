const products = require('../models/productModel')

//for user bought products
const addresses = require('../models/addressModel')


//payment
const stripe = require('stripe')('sk_test_51SvCnM2FRWxWdt4UgCIBIYDfJn9nEVtw8kHlcTbNlCgsQFW3APP0RHabXlll4EyN8k1iOGN6F9JBqweF8QLF1MmU002wt6wRUB')

//----------------Authorized--------------------
   //--------Admin-------------------
        //1)To  add a product by admin
        exports.addAProductByAdminController = async(req,res)=>{
            console.log("Inside addAProductByAdminController!!!!!!!!!!! ");
             //Now to add book details into database , we need to destructure the request body. uploadImg not used here, bought and status is also not included
             const {name, productcode,brand,ageGroup,color,price,discountPrice,description, occasion,idealFor ,fabrictype,fabricCare}=req.body
            //req payload comes from adminMiddleware, and admin has the option to sell a product
             const adminMail = req.payload
             //We do not need all details from the uploaded images, only unique file name is needed , like image-1765430674412-oam (2).jpeg , it must hold names of 3 files, so it is set as an array.
             var uploadImg =[]
             req.files.map(file=>uploadImg.push(file.filename))
             console.log(name, productcode,brand,ageGroup,color,price,discountPrice,description, occasion,idealFor ,fabrictype,fabricCare,adminMail);
             try{
                const excistingProduct = await products.findOne({productcode})
                if(excistingProduct){
                    res.status(401).json("You Have Already Added This Product!!!!!!!!!!")
                }else{
                    const newProduct = new products({
                        name, productcode,brand,ageGroup,color,price,discountPrice,description, occasion,idealFor ,fabrictype,fabricCare,uploadImg
                    })
                     //save method to save in db
                     await newProduct.save()
                     res.status(200).json(newProduct)
                }

             }catch(err){
                res.status(500).json(err)
             }
             

        }
        
        //2)Admin to see all products
        exports.getAllProductsForAdminController = async(req,res)=>{
         try{
            const allProducts = await products.find()
            res.status(200).json(allProducts)

         }catch(err){
            res.status(err).json(err)
         }
        }

        //3)Admin to delete a product added.
        exports.deleteAProductByAdminController=async(req,res)=>{
         console.log("Inside deleteAProductByAdminController!!");
         //id of the product is needed
         const {id} = req.params
         console.log((id));
         try{
            //No variable is needed here 
            await products.findByIdAndDelete({_id:id})
            res.status(200).json("Product Deleted Successfully!!")

         }catch(err){
            res.status(500).json(err)
         }
         
         
        }

        //4)Admin to get returned products and cancelled in returns of odersAdmin page
        exports.getReturnedAndCancelledProductsForAdminController = async (req, res) => {
              try {
               const returnedProducts = await addresses.find({
                 orderstatus: { 
                $in: ["Return In Process","Cancel In Process","Cancelled","Returned"] 
                     }
               })

                   res.status(200).json(returnedProducts)

                   } catch (err) {
                         res.status(500).json(err)
                    }
               }
         
         //5)Approve Return 
         exports.approveReturnByAdminController=async(req,res)=>{
            console.log("inside approveReturnByAdminController!!!");
            //address details
            const{id}=req.params
           
           //payload from jwtmiddleware : user who clicks return
                const adminemail = req.payload
              //order same as schema,bought is the logged in person who needs to buy the product. 
       try{
         

         const order = await addresses.findOne({_id:id})
         if(!order){
             res.status(404).json("No Such Returned Order  Found!!!")
         }
         else{
            const updatedOrder = await addresses.findByIdAndUpdate(
            id,{ orderstatus : "Returned"},{ new:true });
            // 3️⃣ update PRODUCT availability : status must become unordered then only someone else can buy it
               await products.findOneAndUpdate({ productcode: order.productcode },{ status:"unordered",bought:"" });
               res.status(200).json({updatedOrder})
         }
         
         }catch(err){
        res.status(500).json(err)
        }
            
         }


         //6)Approve Cancel
         exports.approveCancelByAdminController=async(req,res)=>{
            console.log("inside approveCancelByAdminController!!!");
           //address details
            const{id}=req.params
           
           //payload from jwtmiddleware : user who clicks return
                const adminemail = req.payload
              //order same as schema,bought is the logged in person who needs to buy the product. 
       try{
         

         const order = await addresses.findOne({_id:id})
         if(!order){
             res.status(404).json("No Such Cancelled Order  Found!!!")
         }
         else{
            const updatedOrder = await addresses.findByIdAndUpdate(
            id,{ orderstatus : "Cancelled"},{ new:true });
            // 3️⃣ update PRODUCT availability : status must become unordered then only someone else can buy it
               await products.findOneAndUpdate({ productcode: order.productcode },{ status:"unordered",bought:"" });
               res.status(200).json({updatedOrder})
         }
         
         }catch(err){
        res.status(500).json(err)
        }
             
         }

         //7)Confirm delivery
          exports.approveDeliveryByAdminController=async(req,res)=>{
            console.log("inside approveDeliveryByAdminController!!!");
            //address details
            const{id}=req.params
           
           //payload from jwtmiddleware : user who clicks return
                const adminemail = req.payload
              //order same as schema,bought is the logged in person who needs to buy the product. 
       try{
         

         const order = await addresses.findOne({_id:id})
         if(!order){
             res.status(404).json("No Such  Order  Found!!!")
         }
         else{
            const updatedOrder = await addresses.findByIdAndUpdate(
            id,{ orderstatus : "sold"},{ new:true });
            // 3️⃣ update PRODUCT availability : status must become sold then only nobody else must not buy it. Product dissapears from allproducts.
               await products.findOneAndUpdate({ productcode: order.productcode },{ status:"sold" });
               res.status(200).json({updatedOrder})
         }
         
         }catch(err){
        res.status(500).json(err)
        }
            
         }

   //----------user-------------------
         //1)get all products for users when users after logging in and clicking shop navigation menu from headers
         exports.getAllproductsForUsersController=async(req,res)=>{
                 console.log ("Inside getAllproductsForUsersController!!!!!!")
                 //for search in All products page, we get query parameter which is a key value pair from queries in the request. searchKey is a key defined by us  eg: https://www.google.com/search?q=javascript+basics&rlz=1C1VDKB_enIN927IN927&oq=javascript+basics&gs_lcrp=EgZjaHJvbWUyDwgAEE. search should also be the same in the frontend.
                 const searchKey = req.query.search 
                 //usermail was assigned to payload key in req object in jwtmiddleware
                 const emailofuser = req.payload
                 const query ={
                   //regex is for comparison, options value i means it is case insensitivity
                 $or :
                 [
                  {name:{$regex : searchKey,$options :'i'}},
                  {color:{$regex : searchKey,$options :'i'}},
                  {fabrictype:{$regex : searchKey,$options :'i'}},
                  {idealFor:{$regex : searchKey,$options :'i'}}
                 ]
                  }
                 try{
                  const allproductsForUsers = await products.find(query)
                  res.status(200).json(allproductsForUsers)

                 }catch(err){
                  res.status(500).json(err)
                 }
         }

         //2)view a single product
         exports.viewASingleProductController=async(req,res)=>{
            console.log("Inside viewASingleProductController!!!! ");
            //to get id of a particular product
            const {id} = req.params
            try{
               //_id is unique in mongo db , findOne() can also be used 
               const viewAProduct = await products.findById({_id:id})
               res.status(200).json(viewAProduct)

            }
            catch(err){
               res.status(500).json(err)

            }
            
         }

         //3)user Bought Books, in profile component purchase history --only controller done, to be continued.
         exports.getAllUserBoughtProductsController=async(req,res)=>{
            console.log("Inside getAllUserBoughtProductsController!! ");
            const emailOfUser = req.payload
            try{
               //bought was declared in schema, which was empty initially, to start from recent orders
               const userboughtproducts = await addresses.find({usermail:emailOfUser}).sort({_id:-1})
               res.status(200).json(userboughtproducts)


            }catch(err){
               res.status(500).json(err)
            }
            

         }
         
         //make payment ----user
         exports.makeProductPaymentController = async(req,res)=>{
        console.log("Inside makeProductPaymentController! ");
        //Product Details
        const{_id,name, productcode,brand,ageGroup,color,price,discountPrice,description, occasion,idealFor ,fabrictype,fabricCare,uploadImg}=req.body
        //payload from jwtmiddleware
        const email = req.payload
          try{
        //order same as schema,bought is the logged in person who needs to buy the product. 
       const updateProductDetails = await products.findByIdAndUpdate({_id},{name, productcode,brand,ageGroup,color,price,discountPrice,description, occasion,idealFor ,fabrictype,fabricCare,uploadImg,status:'ordered',bought:email},{new:true})
         console.log(updateProductDetails);
         //stripe checkout sessions : array of objects
    const line_items = [{
      //price_data is also object
      price_data:{
              currency:'usd',
              //object
              product_data:{
                //string
                name:name,
                description: `${fabrictype} | ${color}`,
                //array
              images:uploadImg,
              //additional information , uploadImg not needed.
              metadata:{
                name, productcode,brand,ageGroup,color,price,discountPrice,description, occasion,idealFor ,fabrictype,fabricCare,status:'ordered',bought:email
              },
              },
              
              //cent, usd so 1D = 100.
              unit_amount:Math.round(discountPrice*100)

      },
      //only 1 book available
      quantity:1

    }]
    //checkout session creation code from stripe website
    const session = await stripe.checkout.sessions.create({
         //array
      payment_method_types:["card"],
          //key and value are same
          line_items,
          mode: 'payment',
          //url which we must see in frontend when payment is successful!.
         // success_url: 'http://localhost:5173/payment-success',
          //cancel_url or if error url
          //cancel_url : 'http://localhost:5173/payment-error'
          success_url: 'https://lilwonders-frontend.vercel.app/payment-success',
          cancel_url : 'https://lilwonders-frontend.vercel.app/payment-error'

            });
            console.log(session) 
             res.status(200).json({checkoutSessionURL:session.url})   
    
        
        }catch(err){
        res.status(500).json(err)
        }


         }

        //Return order by user
         exports.ReturnOrderByUserController = async(req,res)=>{
            console.log("Inside ReturnOrderByUserController!");
            //address details
            const{id}=req.params
           
           //payload from jwtmiddleware : user who clicks return
                const email = req.payload
              //order same as schema,bought is the logged in person who needs to buy the product. 
       try{
         

         const order = await addresses.findOne({_id:id,usermail:email})
         if(!order){
             res.status(404).json("Order Not Found")
         }
         else{
            const updatedOrder = await addresses.findByIdAndUpdate(
            id,{ orderstatus : "Return In Process"},{ new:true });
            // 3️⃣ update PRODUCT availability : status must become unordered then only someone else can buy it
               await products.findOneAndUpdate({ productcode: order.productcode },{ status:"Return In Process" });
               res.status(200).json({updatedOrder})
         }
         
         }catch(err){
        res.status(500).json(err)
        }
       }

       //Return order by user
         exports.CancelOrderByUserController = async(req,res)=>{
            console.log("Inside cancelOrderByUserController!");
            //address details
            const{id}=req.params
             //payload from jwtmiddleware
                const email = req.payload
              //order same as schema,bought is the logged in person who needs to buy the product. 
       try{
          const order = await addresses.findOne({_id:id,usermail:email})
         if(!order){
             res.status(404).json("Order Not Found")
         }
         else{
            const updatedOrder = await addresses.findByIdAndUpdate(
            id,{ orderstatus :"Cancel In Process" },{ new:true });
            // 3️⃣ update PRODUCT availability
               await products.findOneAndUpdate({ productcode: order.productcode },{ status:"Cancel In Process" });
               res.status(200).json({updatedOrder})
         }
         }catch(err){
        res.status(500).json(err)
        }
       }

         


//--------------Unauthorized----------------------

   //-------------Admin----------------------


   //-------------Users-------------------------
   //1)to get all products in HOME page .get home products - all  users can see without logging in , so no middleware here , no need of request here, only products from db must be shown.
   exports.getAllProdctsInHomePageController=async(req,res)=>{
      console.log("Inside getAllProdctsInHomePageController!! ");
      
      try{
         //sort is used to arrange products, _id is unique value in mongo db, -1 to arrange products in descending order , latest uploaded product will be displayed first, limit is used here because we need only 4 products to be shown in the home page 
         const allHomeProducts = await products.find().sort({_id:-1}).limit(4)
         res.status(200).json(allHomeProducts)

      }catch(err){
         res.status(500).json(err)
      }
      
   }

    
