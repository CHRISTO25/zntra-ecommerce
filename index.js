const mongoose=require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/Zntra');//env---

const express=require('express')
const path=require('path')
const app=express()//----------
const session = require('express-session')
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid')
const config=require('./config/config')
const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore({
  uri: 'mongodb://127.0.0.1:27017/Zntra',
  collection: 'sessions'
});

app.use('/static',express.static(path.join(__dirname,'public')))

app.use(session({
    secret: uuidv4(),//crypto
    // secret: 'uuidv4()',//crypto
    saveUninitialized: false,
    cookie: {
      maxAge: 600000000,
    },
    resave: false,
    // store,
  }));

const User_routes=require('./routes/userRoutes')
app.use('/',User_routes)

const admin_routes=require('./routes/adminRoutes')
app.use(admin_routes)


app.listen(config.PORT,()=>{
    console.log("click http://localhost:5453");
})


const Coupon = require('./models/couponModel');
app.get('/coupons/:code', async (req, res) => {
  const coupon_code = req.params.code;
  const coupon = await Coupon.findOne({coupon_code}).lean().exec();

  if(!coupon) {
    res.send({coupon: null});
    return;
  }

  res.send({coupon: {
    coupon_code: coupon.coupon_code,
    coupon_amount: coupon.coupon_amount,
    coupon_minimum: coupon.coupon_minimum,
  }});

})