const mongoose=require('mongoose')
const { schema } = require('./userModel')
const { array } = require('../middleware/multer')

const productsSchema=new mongoose.Schema({
         product_name:{
            type:String,
            required:true
         },
         product_description:{
            type:String,
            required:true
         },
         product_quantity:{
            type:Number,
            required:true
         },
         product_price:{
            type:Number,
            required:true
         },
         product_category:{
            type:String,
            required:true
         },
         product_image:{
            type:Array,
            required:true
         },
         product_verified:{
            type:Boolean,
            default:true
         }
})

module.exports=mongoose.model('Product',productsSchema)