const mongoose=require('mongoose')
const OrderSchema = mongoose.Schema({
    user_details:{
        type:mongoose.Schema.Types.Mixed,
        ref: "User"
    },
    text_message:{
        type:String
    },
    shipping_address:{
       type:mongoose.Schema.Types.Mixed,
       required:true
    },
    payment_meathod:{
        type:String,
        required:true
    },
    user_cart:{
        type:mongoose.Schema.Types.Mixed,
        required:true
    },
    total_amount:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        default: Date.now
    },
    delivery_date:{
        type:Date
    },
    status:{
        type:Number,
        required:true
    },
    varifyed:{
        type:Boolean,
        default:false
    }
})

module.exports=mongoose.model('Order',OrderSchema)