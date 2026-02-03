const reviews = require('../models/reviewModel')

//add a review
exports.addAProductReviewByUserController=async(req,res)=>{
    console.log("Inside addAProductReviewByUserController!");
    //defining reqbody
    const {customername, stars,rating}= req.body
    //email from request payload as is defined in middleware
    const email = req.payload
    try{
        const newReview = new reviews({
            customername, stars,rating,email
        })
        //save review in DB
        await newReview.save()
        res.status(200).json(newReview)

    }catch(err){
        res.status(500).json(err)
    }
    
}

//1)to get all reviews in HOME page .get home products - all  users can see without logging in , so no middleware here , no need of request here, only products from db must be shown.
   exports.getAllReviewsInHomePageController=async(req,res)=>{
      console.log("Inside getAllReviewsInHomePageController!! ");
      
      try{
         //sort is used to arrange products, _id is unique value in mongo db, -1 to arrange reviews in descending order , latest uploaded review will be displayed first, limit is used here because we need only 4 reviews to be shown in the home page 
         const allHomeReviews = await reviews.find().sort({_id:-1}).limit(4)
         res.status(200).json(allHomeReviews)

      }catch(err){
         res.status(500).json(err)
      }
      
   }