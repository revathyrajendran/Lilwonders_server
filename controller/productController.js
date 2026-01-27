const products = require('../models/productModel')

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
               //bought was declared in schema, which was empty initially
               const userboughtproducts = await products.find({bought:emailOfUser})
               res.status(200).json(userboughtproducts)


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
         //sort is used to arrange products, _id is unique value in mongo db, -1 to arrange products in descending order , latest uploaded product will be displayed first, limit is used here because we need only 4 books to be shown in the home page 
         const allHomeProducts = await products.find().sort({_id:-1}).limit(4)
         res.status(200).json(allHomeProducts)

      }catch(err){
         res.status(500).json(err)
      }
      
   }
