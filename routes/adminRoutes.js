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
 const salesController = require('../controllers/salesController')
 const bannerController = require('../controllers/bannerController')

//==========================admin login================================

 admin_routes.get('/admin',auth.admin_isLogout,adminController.loadAdminlogin)
 admin_routes.post('/adminlogin',adminController.verifyAdminlogin)

 //=========================dashboard==================================

 admin_routes.get('/dash',auth.admin_isLogin,adminController.loadDash)
 

 //==========================categories=================================
 admin_routes.get('/categories',auth.admin_isLogin,categoriescontroller.loadCategorypage)
 admin_routes.get('/categoriesAdd',categoriescontroller.loadAddcategories)
 admin_routes.post('/categoriesData',store.single('image'),categoriescontroller.addCategorie)
 admin_routes.get('/delete_cat',categoriescontroller.disableCategory)
 admin_routes.get('/edit_category',auth.admin_isLogin,categoriescontroller.loadcategoryEditpage)
 admin_routes.post('/categoriesDataedit',store.single('image'),categoriescontroller.categoryEditpage)

//==========================users======================================
admin_routes.get('/users_view',auth.admin_isLogin,adminController.loadUsers)
admin_routes.get('/blk_unblk',adminController.userBlk_unblk)


//==========================products===================================
admin_routes.get('/addproduct',auth.admin_isLogin,productController.loadAddproduct)
admin_routes.post('/insert_product',store.array('image',4),productController.insertProducts)
admin_routes.get('/view_products',productController.loadviewProducts)
admin_routes.get('/active_disable',productController.loadActive_Disable)
admin_routes.get('/editProduct',auth.admin_isLogin,productController.loadProductedit)
admin_routes.post('/edit_the_product',store.array('image',4),productController.productEdit)

//==========================coupons======================================
admin_routes.get('/add_coupons',couponController.load_addCoupon)
admin_routes.post('/Coupon_add',couponController.Save_Coupon)
admin_routes.get('/view_coupons',couponController.load_coupon_page)
admin_routes.get('/delete_coupon',couponController.delete_coupon_sucess)

//==========================orders=======================================

admin_routes.get('/order_view_admin',auth.admin_isLogin,orderController.view_order_task)
admin_routes.get('/view_user_order',orderController.Order_setup)
admin_routes.get('/approve',orderController.approve_order)
admin_routes.get('/delivery',orderController.delivery_set)
admin_routes.get('/delivered',orderController.delivered_set)
admin_routes.get('/cancel',orderController.cancel_item)

//===========================Sales==========================================

admin_routes.get('/view_sales',auth.admin_isLogin,salesController.load_sales_page)

//==========================Banner===========================================
 admin_routes.get('/add_banner',auth.admin_isLogin,bannerController.load_add_banner)
 admin_routes.post('/insert_banner',store.single('image'),bannerController.insert_banner)
 admin_routes.get('/view_banner',bannerController.load_banner)
 admin_routes.get('/delete_banner',bannerController.delete_banner)
 admin_routes.get('/use_banner',bannerController.use_the_banner)
 admin_routes.get('/remove_banner',bannerController.remove_the_banner)

 //=========================Logout============================================

 admin_routes.get('/admin_logout',adminController.admin_Logout)


 module.exports=admin_routes



 