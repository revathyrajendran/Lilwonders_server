const express= require('express')
const router = express.Router()
const jwtMiddleware = require('../Middlewares/jwtMiddleware')
const userController = require('../controller/usercontroller')
const jobController = require('../controller/jobController')
const productController = require('../controller/productController')
const adminMiddleware = require('../Middlewares/adminMiddleware')
//multerConfig was exported.
const multerConfig = require('../Middlewares/imgMulterMiddleware')
const applicationController = require('../controller/applicationController')
const pdfmulterConfig = require('../Middlewares/pdfMulterMiddleware')


//--------unauthorised user-------------------

//register
router.post('/register',userController.registerController)

//login
router.post('/login',userController.loginController)

//googlelogin
router.post('/google-login',userController.googleloginController)

//-------Admin and Users------------------
 //see all jobs for admin and users, unauthorized so no need oh headers and middlewares. Since No body is passed, reqBody is not passed.
 router.get('/all-jobs',jobController.seeAllJobOppurtunitesController)


//--------------Authorized ----------------------
 //-----Admin----------------
 //add Job
 router.post('/admin-addjob',adminMiddleware,jobController.addJobController)
 //delete job By admin
 router.delete('/job/:id/remove',adminMiddleware,jobController.removeAJobController)
 //see all users list for admin--To be continued!!!!!!
 router.get('/admin-allusers',adminMiddleware,userController.getAllUsersForAdminController)
 //add a product by admin, add product - multerConfig.array('uploadimges',3) , 3 is the max number oif images a user can upload for a book, uploadimges is in the req body.
 router.post('/admin-addproduct',adminMiddleware,multerConfig.array('uploadImges',3),productController.addAProductByAdminController)
//admin to see all products uploaded by admin itself
router.get('/admin-getallproducts',adminMiddleware,productController.getAllProductsForAdminController)
//admin profile update,can also edit profile so multer is also used
router.put('/admin-profile/edit',adminMiddleware,multerConfig.single('profile'),userController.adminProfileEditController)
//admin can delete a added product if not needed any more
router.delete('/admin/:id/deleteproduct',adminMiddleware,productController.deleteAProductByAdminController)
//admin to get   applications ,  applied by the users for a job: get user applications , users submit their resume , so pdfmulterConfig. single is the method and resume is field.
router.get('/all-application/admin',adminMiddleware,applicationController.getApplicationController)



//--------------user-------------------
//get all products after user loggs in to buy, middleware needed, because only looged in user can access
router.get('/user-allproducts',jwtMiddleware,productController.getAllproductsForUsersController)
//view-a product : middleware needed, because only looged in user can access single product page
router.get('/product/:id/view',jwtMiddleware,productController.viewASingleProductController)
//No need of logging In, to see all products in Home page
router.get('/home-products',productController.getAllProdctsInHomePageController)
//to change profile of a loggedin user,token is needed. multerConfig uses single() method here, beacause it uses only one photo here
router.put('/user-profile/edit',jwtMiddleware,multerConfig.single('profile'),userController.loggedInUserProfileEditController)
//to get all products bought by a user---do API
router.get('/user-bought/products',jwtMiddleware,productController.getAllUserBoughtProductsController)
//user applying for a job: add-application, users submit their resume , so pdfmulterConfig. single is the method and resume is field.
router.post('/user-application/add',jwtMiddleware,pdfmulterConfig.single('resume'),applicationController.addApplicationController)


 

module.exports = router