const express=require('express')
const admin_routes=express()
const bodyparser=require('body-parser')
const session=require('express-session')
const store = require("../middleware/multer");

admin_routes.set('view engine','ejs')
admin_routes.set('views','./views/admin')

const auth = require("../middleware/userAuth")


admin_routes.use(bodyparser.json())
admin_routes.use(bodyparser.urlencoded({extended:true}))

//========================controller===================================

 const adminController=require('../controllers/adminController')
 const categoriescontroller=require('../controllers/categoryController')
 const productController=require('../controllers/productController')
 const couponController=require('../controllers/couponController')
 const orderController=require('../controllers/OrderController')
//==========================admin login================================

 admin_routes.get('/admin',adminController.loadAdminlogin)
 admin_routes.post('/adminlogin',adminController.verifyAdminlogin)

 //=========================dashboard==================================

 admin_routes.get('/dash',adminController.loadDash)
 

 //==========================categories=================================
 admin_routes.get('/categories',categoriescontroller.loadCategorypage)
 admin_routes.get('/categoriesAdd',categoriescontroller.loadAddcategories)
 admin_routes.post('/categoriesData',store.single('image'),categoriescontroller.addCategorie)
 admin_routes.get('/delete_cat',categoriescontroller.disableCategory)
 admin_routes.get('/edit_category',categoriescontroller.loadcategoryEditpage)
 admin_routes.post('/categoriesDataedit',store.single('image'),categoriescontroller.categoryEditpage)

//==========================users======================================
admin_routes.get('/users_view',adminController.loadUsers)
admin_routes.get('/blk_unblk',adminController.userBlk_unblk)


//==========================products===================================
admin_routes.get('/addproduct',productController.loadAddproduct)
admin_routes.post('/insert_product',store.array('image',4),productController.insertProducts)
admin_routes.get('/view_products',productController.loadviewProducts)
admin_routes.get('/active_disable',productController.loadActive_Disable)
admin_routes.get('/editProduct',productController.loadProductedit)
admin_routes.post('/edit_the_product',store.array('image',4),productController.productEdit)

//==========================coupons======================================
admin_routes.get('/add_coupons',couponController.load_addCoupon)
admin_routes.post('/Coupon_add',couponController.Save_Coupon)


//==========================orders=======================================

admin_routes.get('/order_view_admin',orderController.view_order_task)
admin_routes.get('/view_user_order',orderController.Order_setup)

 module.exports=admin_routes



 