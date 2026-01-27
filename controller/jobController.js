//job model importing 
const jobs = require('../models/jobModel')

//----------authorized---------------------
   //add job , by admin
   exports.addJobController=async(req,res)=>{
    console.log("Inside addJobController ");
    //destructuring request body with keys from schema, req Body
    const { title,location,type,salary, qualification,experience,description} = req.body
    try{
        //in db, if there is any job with same details is checked, if yes it must not repeat 
        const jobDetails = await jobs.findOne({title,location})
        //if the job admin trying to add already excists
        if(jobDetails){
          res.status(409).json("Job Already excists!!!!!!!!")
        }
        //if no such job excists
        else{
            const newJob = new jobs({
                title,location,type,salary, qualification,experience,description
            })
            await newJob.save()
            res.status(200).json(newJob)
        }

    }catch(err){
        res.status(500).json(err)
    }
    
   }

   //remove a job by admin
   exports.removeAJobController=async(req,res)=>{
    console.log("inside removeAJobController!!!!! ");
     //we need to get id of the job to be deleted, so here we use params
     const {id} = req.params
     try{
        const deleteAJob = await jobs.findByIdAndDelete({_id:id})
         res.status(200).json(deleteAJob)


     }catch(err){
        res.status(500).json(err)
     }
    
   }

   
    

   

   

   


//--------unauthoized------------------------

//to see all jobs for Admin and Users
   exports.seeAllJobOppurtunitesController=async(req,res)=>{
    console.log("Inside  seeAllJobOppurtunityController!");
    //search key from search key of url, we get searchkey.req.query is an object in Express.js that contains data sent through the URL as query parameters.
//When you send a request like /jobs?location=Kochi&type=fulltime, Express stores { location: "Kochi", type: "fulltime" } inside req.query.
//It is mainly used in GET requests to filter or search data.
//Unlike req.body, req.query does not require body-parser middleware.
//You can access values using req.query.parameterName.
    const jobSearchKey = req.query.search
    //defining query
    const query ={
        //$regex is used to search for text patterns, and $options: "i" makes the search case-insensitive.
        title:{$regex:jobSearchKey,$options:"i"}
    }
    try{
        //to see every jobs altogether , find is used. Jobs are uploaded only by admin
        const allJobs = await jobs.find(query)
        res.status(200).json(allJobs)

    }catch(err){
        res.status(500).json(err)
    }
   }

