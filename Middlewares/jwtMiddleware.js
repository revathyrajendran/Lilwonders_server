//importing jwt webtoken
const jwt = require('jsonwebtoken')

//middlewares have three arguments namely req,res and next. jwtMiddleware is used for authorization
const jwtMiddleware = (req,res,next)=>{
    console.log("Inside jwtMiddleware");

    //token is placed inside request header in "Authorisation" key after Bearer.
    const token = req.headers.authorization.split(" ")[1]
    //console.log(token);
    try{
        //token verification
        
        const jwtResponse = jwt.verify(token,process.env.JWTSECRET)
        //console.log(jwtResponse); { userMail: 'maxmiller@gmail.com', iat: 1765353312 }
       
        //payload is just a variable name, it is not present in request, req and response are objects and we are assigning a key and value to that object.
        req.payload = jwtResponse.userMail
       //console.log(req.payload);
    }catch(err){
        res.status(401).json("Invalid Token",err)
    }
    
    //next() method of the middleware is called for control transfering from middleware to controller.
    next()
    
}

module.exports = jwtMiddleware