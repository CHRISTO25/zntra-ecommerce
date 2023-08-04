const Order=require('../models/orderModel')
const User = require('../models/userModel')
const Cart = require('../models/cartModel')
const Product = require('../models/productModel')
const mongoose = require('mongoose')



const load_sales_page = async(req,res)=>{
    try {
    
     const order = await Order.find()
const send =order[0]
   


  const orderCart = await Order.aggregate([
  {
    $lookup: {
        from:"products",
        localField:"user_cart.products.product_id",
        foreignField:"_id",
        as:"product_details"
    }
  },
  {
    $unwind: "$product_details"
  },
  {
    $lookup: {
        from:"users",
        localField:"user_details",
        foreignField:"_id",
        as:"user_details"
    }
  },
  {
    $unwind: "$user_details"
  },
  ]);
  const cartItems = orderCart.map(cartItem => ({
    details: cartItem.product_details,
    method:cartItem.payment_meathod,
    user:cartItem.user_details,
    payment:cartItem.payment_meathod,
    total_amount:cartItem.total_amount,
    shipping_address:cartItem.shipping_address,
    quantity: cartItem.user_cart.products.find(product => product.product_id.toString() === cartItem.product_details._id.toString()).quantity,
    buy: cartItem.user_cart.products.find(product => product.product_id.toString() === cartItem.product_details._id.toString()).buy,
    status: cartItem.user_cart.products.find(product => product.product_id.toString() === cartItem.product_details._id.toString()).status
  }));
 
     
    

        console.log('------------------------------------------------------------------');
    console.log(cartItems);
    console.log('------------------------------------------------------------------');

      res.render('sales_view',{data:cartItems,er:"the sales report"})

    } catch (error) {
        console.log(error.message);
    }
}


module.exports={
           load_sales_page
}