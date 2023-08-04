const User = require('../models/userModel')

const isLogin = async (req, res, next) => {
    try {

        if (!req.session.user_id) {
            res.redirect('/')
        } else {
            next()
        }


    } catch (error) {
        console.log(error.message);
    }

}


const isLogout = async (req, res, next) => {
    try {

        if (req.session.user_id) {
            res.redirect('/home')
        } else {
           res.render('signin')
        }
        // next()
    } catch (error) {
        console.log(error.message);
    }
}

const blockCheck = async (req, res, next) => {

    try {
        if (req.session.user) {
            // const id = req.session.blockedUser
            const id = req.session.user_id
            const user = await User.findById(id)

            if (user.varified==false) {
                res.redirect('/logout')
            } else {
                next()
                console.log("hii");
            }
        } else {
            next()
        }

    } catch (error) {
        console.log(error.message);
    }


}


// const blockCheck = async ( req, res, next ) => {

//    // const userData = req.session.user;
//     const id = req.session.blockedUser
//     const user = await User.findById(id)
//     //console.log(user.name)

//      if(user.is_blocked){
//        res.redirect('/logout')
//      }else{
//         next()
//    }
//  }

 

const admin_isLogout = async (req, res, next) => {
    try {

        if (req.session.admin_verify==1) {
            res.redirect('/dash')
        } else {
           res.render('login',{message:"please login"})
        }
        // next()
    } catch (error) {
        console.log(error.message);
    }
}


const admin_isLogin = async (req, res, next) => {
    try {

        if (req.session.admin_verify !=1) {
            res.redirect('/admin')
        } else {
            next()
        }


    } catch (error) {
        console.log(error.message);
    }

}

module.exports = {
    isLogin,
    isLogout,
    blockCheck,
    admin_isLogout,
    admin_isLogin
}