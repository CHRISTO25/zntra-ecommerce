
const User = require('../models/userModel')
const Order=require('../models/orderModel')
const Product=require('../models/productModel')
const Category=require('../models/categoriesModel')

const argon2=require('argon2')


const loadAdminlogin=async(req,res)=>{
    try {
      
    res.render('login',{message:"please login"})
    } catch (error) {
        console.log(error.message);
    }
}

const verifyAdminlogin=async(req,res)=>{
    try {
        const email=req.body.name
        const password=req.body.pass
        console.log(password);
        const userData=await User.find({email:email})
        if(userData[0])
        {
          
          const  userPass = await userData[0].password
            const passwordMatch=await argon2.verify(userPass,password)
            if(passwordMatch)
            {
            //   req.session.user = true;
            //   req.session.user_id = userData[0]._id;
            //   req.session.cartUser = userData[0];
                if(userData[0].admin==true)
                {
                    req.session.admin_verify = 1
                    res.redirect('/dash')
                }
                else{
                    res.render('login',{message:"make sure all details are correct"})
                }
            }
            else{
              res.render('login',{message:" password incorrect"})
            }
        }
        else{
          res.render('login',{message:"email not found"})
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

 const  loadDash=async(req,res)=>{
    try {

        const usr = await User.find()
        const prd = await Product.find()
        const ordr= await Order.find()
        const ctgry =await Category.find()
        
         res.render('dash',{allu:usr.length,allp:prd.length,allo:ordr.length,allc:ctgry.length})
    } catch (error) {
        console.log(error.message);
    }
 }
 const loadUsers=async(req,res)=>
 {
    try {
        const data=await User.find()
        if (data) {
            res.render('users',{data:data,er:"welcome to users page"})      
        } else {
            res.render('users',{er:"no users have been found"})
        }
    } catch (error) {
        console.log(error.message);
    }
 }

 const userBlk_unblk=async(req,res)=>
 {
    try {
        const id=req.query.id
        console.log(id);
        const userfind = await User.find({_id:id});
        console.log(userfind);
        if(userfind[0].varified==true)
        {
            await User.findByIdAndUpdate({_id:id},{$set:{varified:false}})
        }
        else{
            await User.findByIdAndUpdate({_id:id},{$set:{varified:true}})
        }
       
        const data = await User.find();

        if (data) {
            res.render('users',{data:data,er:"welcome to users page"})      
        } else {
            res.render('users',{er:"cannot make changes to this the user"})
        }
       
    } catch (error) {
        console.log(error.message);
    }
 }

 const admin_Logout = async (req, res) => {
    try {
        req.session.admin_verify=null
     
      res.redirect('/admin')
  
    } catch (error) {
      console.log(error.message);
    }
  }

module.exports={loadAdminlogin,
                verifyAdminlogin,
                loadDash,
                loadUsers,
                userBlk_unblk,
                admin_Logout
                }
