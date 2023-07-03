const mongoose=require('mongoose')
const { schema } = require('./userModel')

const categoriesSchema=new mongoose.Schema({
    cat_name:{
        type:String,
        required:true
    },
    cat_description:{
        type:String,
        required:true
    },
    cat_image:{
        type:String,
        required:true
    },
    cat_verify:{
        type:Boolean,
        default:true
    }
})

module.exports=mongoose.model('Category',categoriesSchema)