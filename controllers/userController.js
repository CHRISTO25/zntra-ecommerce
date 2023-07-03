const User=require('../models/userModel')
const Category=require('../models/categoriesModel')
const Product=require('../models/productModel')
const argon2=require('argon2')
const nodemailer=require('nodemailer')
const config=require('../config/config')
const { ObjectId } = require('mongodb')

const loadSignin=async(req,res)=>{
    try {
        res.render('signin',{message:"Please Login"})
    } catch (error) {
        console.log(error.message);
    }
}

const loadSignup=async(req,res)=>{
    try {
        res.render('signup')
    } catch (error) {
       console.log(error.message); 
    }
}

const securePassword=async(password)=>{
    try {
        const passwordHash=await argon2.hash(password)
        return passwordHash;
    } catch (error) {
        console.log(error.message);
    }
}

const Logout = async (req, res) => {
  try {
    req.session.destroy()
    userData = null
    res.redirect('/signin')

  } catch (error) {
    console.log(error.message);
  }
}




function generateOTP() {
    let otp = "";
    for (let i = 0; i < 6; i++) {
      otp += Math.floor(Math.random() * 10);
    }
    return otp;
  }

  const sendOtpMail = async (email, otp) => {
    try {
      // Create a Nodemailer transport object
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user:config.ADMIN_EMAIL,
          pass: config.APP_PASSWORD
        }
        
      });
  
      // Define email options
  
      const mailOptions = {
        from: 'christovarghese555@gmail.com',
        to: email,
        subject: 'Your OTP for user verification',
        text: `<b>Your OTP is ${otp}. Please enter this code to verify your account.</b>`
      };
  
      // Send the email
      const result = await transporter.sendMail(mailOptions);
      console.log(result);
    } catch (error) {
  
      console.log(error.message);
    }
  }
  

const sendOtp= async(req,res)=>{
    try {
       
        const name = req.session.globalName;
        const username=req.session.globalUsername;
        const mobile = req.session.golbalMobile;
        const email = req.session.globalEmail;
        const password = req.session.globalPass;  
        
    
        const emailExist = await User.findOne({ email: req.body.email ? req.body.email : email });
        if (!emailExist) {
          const generatedOtp = generateOTP();
          req.session.otp = generatedOtp;
          req.session.globalName = req.body.name ? req.body.name : req.session.globalName;
          req.session.globalUsername = req.body.username ? req.body.username : req.session.globalUsername;
          req.session.globalEmail = req.body.email ? req.body.email : req.session.globalEmail;
          req.session.golbalMobile = req.body.number ? req.body.number: req.session.golbalMobile;
          req.session.globalPassword = req.body.pass ? req.body.pass : req.session.globalPass;
          sendOtpMail(req.session.globalEmail, generatedOtp);
          setTimeout(() => {
            req.session.otp = null;
          }, 90000); 
          res.redirect('otp');
        } else {
          res.redirect("signup");
        }
        
    } catch (error) {
        console.log(error.message);
    }
}


const verifyOtp = async (req, res) => {

    const EnteredOtp = req.body.otp;
    console.log(EnteredOtp[0]);
    console.log(req.session.otp);
    if (EnteredOtp[0] == req.session.otp) {
      const securedPassword = await securePassword(req.session.globalPassword);
      const newUser = new User({
        name: req.session.globalName,
        username:req.session.globalUsername,
        email: req.session.globalEmail,
        number: req.session.golbalMobile,
        password: securedPassword,
      });
      const userData=await newUser.save()

        if(userData)
           {
            res.render('signin',{message:"Login Now"})
           }
           else
           {
            res.redirect('/signup')
           }
    } else {
      res.render('otp', { invalidOtp: "wrong OTP" })
    }
  }


const verifyLogin=async (req,res)=>{
    try {
        
        const email=req.body.email
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


                if(userData[0].varified==true)
                {
                    res.redirect('/home')
                }
                else{
                    res.render('signin',{message:"you have been blocked"})
                }
            }
            else{
              res.render('signin',{message:" password incorrect"})
            }
        }
        else{
          res.render('signin',{message:"email not found"})
        }
    } catch (error) {
        console.log(error.message);
    }
}



const loadOtp=async(req,res)=>
{
    try {

        res.render('otp')
        
    } catch (error) {
        console.log(error.message);
    }
}


const loadhome=async(req,res)=>
{
  try {
    const categoryData = await Category.find();
    res.render('home',{data:categoryData})
  } catch (error) {
    console.log(error.message);
  }
}


const load_Items_Page=async(req,res)=>{
  try {
    const id =req.query.id
    const categoryData = await Category.find({_id:id});
    const cat=categoryData[0].cat_name
    const productData = await Product.find({product_category:cat});
    
    res.render('items',{data:productData})
  } catch (error) {
    console.log(error.message);
  }
}

const load_details=async(req,res)=>{
  try {
    const id= req.query.id
    const details=await Product.find({_id:id})
    const deta=details[0]
    res.render('detail',{data:deta})
  } catch (error) {
    console.log(error.message);
  }
}

const load_profile=async(req,res)=>{
  try {
    const id=req.session.user_id
    const user_data=await User.find({_id:id})
    console.log("details ====== ",id);
    console.log(user_data);
    const users=user_data[0]
    if (users) {
      res.render('profile',{data:users,er:"profile loaded"})
    } else {
      res.render('profile',{data:user_data,er:"no details found"})
    }
    
  } catch (error) {
    console.log(error.message);
  }
}

const load_upload_image=async (req,res)=>{
  try {
    const id=req.body.id 
    const name=req.body.name
    const username=req.body.username
    const email=req.body.email
    const number=req.body.number
    const address=req.body.address
    const image=req.file
    if(image){
      await User.findByIdAndUpdate({_id:id},{$set:{name:name,username:username,email:email,number:number,image:image.filename,address:address}})
      const user_data=await User.find({_id:id})
      const users=user_data[0]
      if (users) {
        res.render('profile',{data:users,er:"profile loaded"})
      } else {
        res.render('profile',{data:user_data,er:"no details found"})
      }
    }
    else
    {
      await User.findByIdAndUpdate({_id:id},{$set:{name:name,username:username,email:email,number:number,address:address}})
      const user_data=await User.find({_id:id})
      const users=user_data[0]
      if (users) {
        res.render('profile',{data:users,er:"profile loaded"})
      } else {
        res.render('profile',{data:user_data,er:"no details found"})
      }

    }
    

  } catch (error) {
    console.log(error.message);
  }
}

const load_forgot_password_page=async(req,res)=>{
  try {
    res.render('forgot')
  } catch (error) {
    console.log(error.message);
  }
}

const send_otP_forgotpassword=async(req,res)=>{
  try {
    
    const email = req.body.email;
    const emailExist = await User.findOne({ email:email });
    if (emailExist) {
      const generatedOtp = generateOTP();
      req.session.otp = generatedOtp;
      req.session.Email = email
      sendOtpMail(email, generatedOtp);
      setTimeout(() => {
        req.session.otp = null;
      }, 90000); 
      res.redirect('/load_forgot_otp');
    } else {
      res.redirect("signup");
    }
    

  } catch (error) {
    console.log(error.message);
  }
}

const load_forgot_otp=async(req,res)=>{
  try {
    res.render('forgot_otp')
  } catch (error) {
    console.log(error.message);
  }
} 

const verify_otp_forgot=async(req,res)=>{
     try {
      const EnteredOtp = req.body.otp;
    console.log(EnteredOtp[0]);
    console.log(req.session.otp);
    if (EnteredOtp[0] == req.session.otp) {

       
           
            res.render('password',{message:"change password"})
          
            res.render('signin',{message:"something went wrong"})
           
    } else {
      res.render('otp', { invalidOtp: "wrong OTP" })
    }
     } catch (error) {
      console.log(error.message);
     }
}
const Password_updating=async(req,res)=>{
  try {
    const pass=await securePassword(req.body.pass)
    const data= await User.find({email:req.session.Email})
    const id=data[0]._id
    await User.findByIdAndUpdate({_id:id},{$set:{password:pass}})
    res.redirect('/signin')
  } catch (error) {
    console.log(error.message);
  }
}

const load_new_password=async(req,res)=>{
  try {
    res.render('new_password',{er:"Type Password"})

  } catch (error) {
    console.log(error.message);
  }
}

const save_new_password=async(req,res)=>{
try {
  const old=req.body.check_pass
  const pass=await securePassword(req.body.pass)
  const id=new ObjectId(req.session.user_id)
  const user=await User.findOne(id)

  const  userPass = await user.password
  const passwordMatch=await argon2.verify(userPass,old)

  if(passwordMatch){
    await User.findByIdAndUpdate({_id:id},{$set:{password:pass}})

    const user_data=await User.find({_id:id})
    console.log("details ====== ",id);
    console.log(user_data);
    const users=user_data[0]
    if (users) {
      res.render('profile',{data:users,er:"profile loaded"})
    } else {
      res.render('profile',{data:user_data,er:"no details found"})
    }

  }
  else{
    res.render('new_password',{er:"wrong password"})
  }


} catch (error) {
  console.log(error.message);
}
}

module.exports={loadSignin,
                loadSignup,
                verifyLogin,
                loadOtp,
                sendOtp,
                verifyOtp,
                loadhome,
                load_Items_Page,
                load_details,
                Logout,
                load_profile,
                load_upload_image,
                load_forgot_password_page,
                send_otP_forgotpassword,
                load_forgot_otp,
                verify_otp_forgot,
                Password_updating,
                load_new_password,
                 save_new_password}