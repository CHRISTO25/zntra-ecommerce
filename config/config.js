const myEnv = require('dotenv').config()
const ADMIN_EMAIL=process.env.EMAIL
const APP_PASSWORD=process.env.APP_PASSWORD
const PORT=process.env.PORT
const RazorID=process.env.RAZORPAY_ID_KEY
const razorpass=process.env.RAZORPAY_SECRET_KEY

module.exports={ADMIN_EMAIL,
                APP_PASSWORD,
                PORT,
                RazorID,
                razorpass}