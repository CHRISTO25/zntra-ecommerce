const Coupon=require('../models/couponModel')


const load_addCoupon=async(req,res)=>{
    try {
        res.render('addCoupon',{er:"Add Coupons"})
        
    } catch (error) {
        console.log(error.message);
    }
}

const Save_Coupon=async(req,res)=>{
    try {
        const name=req.body.name
        const code=req.body.code
        const amount=req.body.amount
        const expire_date=req.body.ex_date
        const description=req.body.description
        const minimum_amount=req.body.min_amount

        console.log(expire_date);
        
        const couponExist = await Coupon.findOne({coupon_name : name });
        console.log(couponExist)
        if (!couponExist) {
            const coupon = new Coupon({
                coupon_name:name,
                coupon_description:description,
                coupon_code:code,
                coupon_amount:amount,
                coupon_expire:expire_date,
                coupon_minimum:minimum_amount
            });
            await coupon.save();
        res.redirect('/add_coupons')
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports={load_addCoupon,
                 Save_Coupon}