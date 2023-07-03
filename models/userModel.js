const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    number:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    admin:{
        type:Boolean,
        default:false
    },
    varified:{
        type:Boolean,
        default:true
    },
    image:{
        type:String,
        default:false
    },
    address:{
      type:String,
      default:"type addres"
    },
    address_2:{
      type:String,
      default:"type address"
    }
})

module.exports=mongoose.model('User',userSchema)