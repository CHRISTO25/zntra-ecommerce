const Order=require('../models/orderModel')
const User = require('../models/userModel')
const Cart = require('../models/cartModel')
const Product = require('../models/productModel')
const mongoose = require('mongoose');

const place_order = async(req,res)=>{
    try {
       
const user = req.session.user_id
const user_data= await User.find({_id:user})
const ship_add =req.body.address_order 
const address = user_data[0].address.find((addr) => addr._id.toString() === ship_add);
const id = req.session.user_id;
const userCart = await Cart.find({user_id:id})


 
// const jsonString = JSON.stringify({hello: 'dklfjldsjfldsjfldsk', blah: 897987987, ddfkj: ['dfd', 8789, true] })
// console.log(jsonString);
// const obj = JSON.parse(jsonString);
// console.log(obj);

// jsonString = "{hello: 'dklfjldsjfldsjfldsk', blah: 897987987, ddfkj: ['dfd', 8789, true], }";





// console.log(total);


const user_details = user_data[0]
const text_message = req.body.text_message
const shipping_address=address
const payment=req.body.paymentMethod
const user_Cart = userCart[0]
const total = req.body.total
console.log("-------------------------------------------------------" ,userCart[0].products.length);
const  order = new Order({
  user_details:user_details,
  text_message:text_message,
  shipping_address:shipping_address,
  payment_meathod:payment,
  user_cart:user_Cart,
  total_amount:total,
  status:userCart[0].products.length
})

await order.save()

 res.redirect('/view_order_page')
        
    } catch (error) {
        console.log(error.message);
    }
}


const load_order_view_page = async(req,res)=>{
   try {

    const id = req.session.user_id
    const order = await Order.find({user_details: new mongoose.Types.ObjectId(id)})
    const send =order[0]
    // console.log('------------------------------------------------------------------');
    // console.log(order[0].total_amount);
    // console.log('------------------------------------------------------------------');


    const userCart = await Order.aggregate([
        {
          $lookup: {
            from: "products",
            localField: "user_cart.products.product_id",
            foreignField: "_id",
            as: "product_details"
          }
        },
        { $unwind: "$product_details" },
      ]);
    
      // Access product details and quantity
      const filteredData = userCart.filter(item => item.user_details.toString() === id.toString());
      const cartItems = filteredData.map(cartItem => ({
        
        details: cartItem.product_details,
         quantity: cartItem.user_cart.products.find(product => product.product_id.toString() === cartItem.product_details._id.toString()).quantity,
         buy: cartItem.user_cart.products.find(product => product.product_id.toString() === cartItem.product_details._id.toString()).buy,
         status:cartItem.user_cart.products.find(product => product.product_id.toString() === cartItem.product_details._id.toString()).status
        
      }));

console.log(cartItems[0].status,"=============buy==============");

      const user=req.session.cartUser.username

    res.render('orders_view_page',{data:cartItems,datas:send,user:user})
   } catch (error) {
    console.log(error.message);
   }
}

const view_order_task = async(req,res)=>{
  try {
    const id = req.session.user_id
    const order = await Order.find({user_details: new mongoose.Types.ObjectId(id)})
    const send =order[0]
    // console.log('------------------------------------------------------------------');
    // console.log(order[0].total_amount);
    // console.log('------------------------------------------------------------------');


    const userCart = await Order.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "user_details",
            foreignField: "_id",
            as: "product_details"
          }
        },
        { $unwind: "$product_details" },
      ]);
    
      // Access product details and quantity
      // const filteredData = userCart.filter(item => item.user_details.toString() === id.toString());
      // const cartItems = filteredData.map(cartItem => ({
        
      //   details: cartItem.product_details,
      //    quantity: cartItem.user_cart.products.find(product => product.product_id.toString() === cartItem.product_details._id.toString()).quantity,
      //    buy: cartItem.user_cart.products.find(product => product.product_id.toString() === cartItem.product_details._id.toString()).buy,
      //    status:cartItem.user_cart.products.find(product => product.product_id.toString() === cartItem.product_details._id.toString()).status
        
      // }));

console.log("=====================================",userCart,"=============buy==============");

      const user=userCart

    res.render('Order_page',{data:user,er:"The order page"})
   } catch (error) {
    console.log(error.message);
   }
}

const Order_setup =async(req,res)=>{
  try {
    const id = req.query.id;

    const userCart = await Order.aggregate([
      { $match: { _id:new  mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "products",
          localField: "user_cart.products.product_id", // Update this field based on your schema
          foreignField: "_id",
          as: "product_details"
        }
      },
      { $unwind: "$product_details" },
    ]);
    
    const cartItems = userCart.map(cartItem => ({
      details: cartItem.product_details,
      quantity: cartItem.user_cart.products.find(product => product.product_id.toString() === cartItem.product_details._id.toString()).quantity,
      buy: cartItem.user_cart.products.find(product => product.product_id.toString() === cartItem.product_details._id.toString()).buy,
      status: cartItem.user_cart.products.find(product => product.product_id.toString() === cartItem.product_details._id.toString()).status
    }));
    
    const user = req.session.cartUser.username;

    console.log("------------------------------",cartItems,"----------------------------------------");
    
    res.render('view_detailed', { data: cartItems,  user: user,er:"make changes" });
    
   } catch (error) {
    console.log(error.message);
   }
}

module.exports = {place_order,
                  load_order_view_page,
                  view_order_task,
                Order_setup}