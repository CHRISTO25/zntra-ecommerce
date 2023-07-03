
const User = require('../models/userModel')
const argon2=require('argon2')


const loadAdminlogin=async(req,res)=>{
    try {
      
    res.render('login')
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
              req.session.user = true;
              req.session.user_id = userData[0]._id;
              req.session.cartUser = userData[0];
                if(userData[0].admin==true)
                {
                    res.redirect('/dash')
                }
                else{
                    res.render('login')
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
         res.render('dash')
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


module.exports={loadAdminlogin,
                verifyAdminlogin,
                loadDash,
                loadUsers,
                userBlk_unblk
                }
