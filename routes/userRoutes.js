const express=require('express')
const user_routes=express()
const bodyparser=require('body-parser')//express.json
const session=require('express-session')
const store = require("../middleware/multer");

user_routes.set('view engine','ejs')
user_routes.set('views','./views/user')

const user_auth = require("../middleware/userAuth")


user_routes.use(bodyparser.json())
user_routes.use(bodyparser.urlencoded({extended:true}))



 const userController=require('../controllers/userController')
 const cartController=require('../controllers/cartController')
 const orderController=require('../controllers/OrderController')
 
//------------------------signin---------------------------
 user_routes.get('/',user_auth.isLogout,userController.loadSignin)
 user_routes.get('/signin',user_auth.isLogout,userController.loadSignin)
 user_routes.post('/signin',userController.verifyLogin)
 user_routes.get('/logout',userController.Logout)

//------------------------signup-------------------------------------


 user_routes.get('/signup',userController.loadSignup)
 user_routes.post('/signup',userController.sendOtp)
 user_routes.get('/otp',userController.loadOtp)
 user_routes.post('/verify_otp',userController.verifyOtp)

//-------------------------forgototp--------------------------------

 user_routes.get('/forgot',userController.load_forgot_password_page)
 user_routes.post('/forgot_check',userController.send_otP_forgotpassword)
 user_routes.get('/load_forgot_otp',userController.load_forgot_otp)
 user_routes.post('/verify_forgot_otp',userController.verify_otp_forgot)
 user_routes.post('/update_password',userController.Password_updating)
//--------------------------change password-------------------------------

 user_routes.get('/change_password',user_auth.isLogin,user_auth.blockCheck,userController.load_new_password)
 user_routes.post('/new_password_save',userController.save_new_password)
  
 //------------------------home---------------------------------------------
 user_routes.get('/home',user_auth.isLogin,user_auth.blockCheck,userController.loadhome)
 user_routes.get('/viewitems',user_auth.blockCheck,userController.load_Items_Page)
 user_routes.get('/details',user_auth.blockCheck,user_auth.isLogin,userController.load_details)

//------------------------------profile-------------------------------------------------------

 user_routes.get('/profile',user_auth.blockCheck,user_auth.isLogin,userController.load_profile)
 user_routes.post('/upload-image',store.single('image'),userController.load_upload_image)

 //----------------------------Address---------------------------------------------------------

 user_routes.post('/add_address',userController.load_add_address)
 user_routes.get('/show_address',userController.show_address)
 user_routes.get('/delete_adress',userController.delete_address)
 
//------------------------------Cart-----------------------------------------------------------

user_routes.get('/add_to_cart_view',user_auth.blockCheck,cartController.load_addtocart)
user_routes.get('/load_cart',user_auth.blockCheck,user_auth.isLogin,cartController.load_Cart_view_user)
user_routes.post('/update-cart-item',user_auth.blockCheck,user_auth.isLogin,cartController.update_cart_item);
user_routes.get('/delete_from_cart',cartController.load_remove_from_cart)

//-----------------------------checkout-----------------------------------------------------------

user_routes.get('/loadcheckout',cartController.loadcheckout_page)
user_routes.post('/place_order',orderController.place_order)

//-----------------------------order page-----------------------------------------------------------

user_routes.get('/view_order_page',orderController.load_order_view_page)

//-----------------------------any page------------------------------------------------------------
// user_routes.get('/*',userController.anyPage)



 module.exports=user_routes