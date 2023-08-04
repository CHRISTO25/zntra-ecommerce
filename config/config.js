const myEnv = require('dotenv').config()
const ADMIN_EMAIL=process.env.EMAIL
const APP_PASSWORD=process.env.APP_PASSWORD
const PORT=process.env.PORT

module.exports={ADMIN_EMAIL,
                APP_PASSWORD,
                PORT}