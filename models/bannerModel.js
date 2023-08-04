
const mongoose=require('mongoose')
const bannerSchema =mongoose.Schema({
    banner_name:{
        type:String,
        required:true
    },
    banner_image:{
        type:String,
        required:true
    },
    in_use:{
        type:Boolean,
        default:false
    }
})

module.exports=mongoose.model('banner',bannerSchema)

