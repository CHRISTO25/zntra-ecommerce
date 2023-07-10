const mongoose=require('mongoose')
const couponSchema =mongoose.Schema({
    coupon_name:{
        type:String,
        required:true,
        unique:true
    },
    coupon_description:{
        type:String,
        required:true,
    },
    coupon_code:{
        type:String,
        required:true,
        unique:true
    },
    coupon_amount:{
        type:Number,
        required:true
    },
    coupon_date:{
        type: Date,
        default: Date.now
    },
    coupon_expire:{
        type: Date,
        required:true
    },
    coupon_minimum:{
        type:Number,
        required:true
    }
})

module.exports=mongoose.model('Coupon',couponSchema)

