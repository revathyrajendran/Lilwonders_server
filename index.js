//no variable for dotenev because it is not used anywhere else and config() loads .env file contents into process.env
require('dotenv').config()
//variables will bw reused
const express = require('express')
//cross origin resource sharing
const cors = require('cors')
//importing router file to a variable
const router = require('./routing/routing')
//db connection , no need for variable, just it has to run using node mongoose
require('./db/connection')

//server creation
const LilWonderServer=express()



// enable cors protocol in server
LilWonderServer.use(cors())

//js cannot understand json , so parsing is done
LilWonderServer.use(express.json())

//server to use router ,place this after cors, then only control returnd from routing.js back to index.js.
LilWonderServer.use(router)

//server  to use uploads folder i the backedn to display images. In thid projects to display images uploaded by a user during selling a book.First  is path of the folder. static is the method to make this available to server
LilWonderServer.use('/uploads',express.static('./uploads'))

//server to make use of pdf folder, which contains resume uploaded by users while applying for a job.
LilWonderServer.use('/pdf',express.static('./pdf'))


//create port - 3000 or any other value
const PORT = 3000

//server should listen 
LilWonderServer.listen(PORT,()=>{
    console.log(`Server started at  ${PORT} `);
    
})
//Now run code using 'node,on index.js' in cmd and in localhost:3000 , you can see Cannot GET / , this is because request is not resolved.

//resolving http request ,only get will be seen , no other outputs
LilWonderServer.get('/',(req,res)=>{
    res.status(200).send('<h1> LilWonder Server Active</h1>')
})
