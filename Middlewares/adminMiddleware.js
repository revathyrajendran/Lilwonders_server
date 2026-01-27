//import jwtWebtoken
const jwt = require('jsonwebtoken')

//Middleware functions has 3 arguments req,res and next
const adminMiddleware=(req,res,next)=>{
    console.log(("Inside adminMiddleware!!!! "));

    //token taking
    
    const token = req.headers.authorization.split(" ")[1]
    //console.log(token);

    //jwtResponse
    const jwtResponse = jwt.verify(token,process.env.JWTSECRET)
    console.log(jwtResponse);

    //payload is just a variable name, it is not present in request, req and response are objects and we are assigning a key and value to that object.
    req.payload = jwtResponse.userMail 
    req.roles = jwtResponse.roles 
    console.log(req.payload);
    
    
    //this is move control from adminMiddleware to controller
    next()

    
}
module.exports = adminMiddleware