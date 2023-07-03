const mongoose=require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/Zntra');//env---

const express=require('express')
const path=require('path')
const app=express()//--------
const session = require('express-session')
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid')
const config=require('./config/config')

app.use('/static',express.static(path.join(__dirname,'public')))

app.use(session({
    secret: uuidv4(),//crypto
    saveUninitialized: true,
    cookie: {
      maxAge: 600000000,
    },
    resave: false
  }));

const User_routes=require('./routes/userRoutes')
app.use('/',User_routes)

const admin_routes=require('./routes/adminRoutes')
app.use(admin_routes)


app.listen(config.PORT,()=>{
    console.log("click http://localhost:5453");
})