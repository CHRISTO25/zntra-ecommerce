const Order = require('../models/orderModel')
const Category = require('../models/categoriesModel')
const User = require('../models/userModel')
const Cart = require('../models/cartModel')
const Product = require('../models/productModel')
const mongoose = require('mongoose')
const Razorpay = require('razorpay')
const auth = require('../config/config')


var instance = new Razorpay({
  key_id: auth.RazorID,
  key_secret: auth.razorpass
})


const createOrder = async (req, res) => {
  try {
    // Razorpay Starts
    const amount = req.body.total * 100;
    const options = {
      amount: amount,
      currency: 'INR',
      receipt: auth.ADMIN_EMAIL,
    };

    instance.orders.create(options, async (err, order) => {
      if (!err) {
        res.status(200).send({
          success: true,
          msg: 'Order Created',
          order_id: order.id,
          amount: amount,
          key_id: auth.RazorID,
          name: req.body.name,
          email: req.body.email,
          mobile: req.body.phone,
        });
      } else {
        res.status(400).send({ success: false, msg: 'Something went wrong' });
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};


const orderSuccess = (req, res) => {
  try {
    res.redirect('/view_order_page')
  } catch (error) {
    console.log(error.message)
  }
}


const place_order = async (req, res) => {
  try {

    const user = req.session.user_id
    const user_data = await User.find({ _id: user })
    const ship_add = req.body.address_order
    const address = user_data[0].address.find((addr) => addr._id.toString() === ship_add);
    const id = req.session.user_id;
    const userCart = await Cart.find({ user_id: id })



    // const jsonString = JSON.stringify({hello: 'dklfjldsjfldsjfldsk', blah: 897987987, ddfkj: ['dfd', 8789, true] })
    // console.log(jsonString);
    // const obj = JSON.parse(jsonString);
    // console.log(obj);

    // jsonString = "{hello: 'dklfjldsjfldsjfldsk', blah: 897987987, ddfkj: ['dfd', 8789, true], }";





    // console.log(total);


    const user_details = user_data[0]
    const text_message = req.body.text_message
    const shipping_address = address
    const payment = req.body.payment
    const user_Cart = userCart[0]
    const total = req.body.total


    if (payment == "paypal") {


    }
    const order = new Order({
      user_details: user_details,
      text_message: text_message,
      shipping_address: shipping_address,
      payment_meathod: payment,
      user_cart: user_Cart,
      total_amount: total,
      status: 2
    })

    await order.save()

    await Cart.findOneAndDelete({ user_id: id })

    res.redirect('/view_order_page')



    console.log("-------------------------------------------------------", userCart[0].products.length);


  } catch (error) {
    console.log(error.message);
  }
}


const load_order_view_page = async (req, res) => {
  try {

    const id = req.session.user_id
    const order = await Order.find({ user_details: new mongoose.Types.ObjectId(id) })
    const send = order[0]
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
      ids:cartItem._id,
      quantity: cartItem.user_cart.products.find(product => product.product_id.toString() === cartItem.product_details._id.toString()).quantity,
      buy: cartItem.user_cart.products.find(product => product.product_id.toString() === cartItem.product_details._id.toString()).buy,
      status: cartItem.user_cart.products.find(product => product.product_id.toString() === cartItem.product_details._id.toString()).status

    }));

     console.log(cartItems, "=============buy==============");

    const user = req.session.cartUser.username

    const categoryData = await Category.find();

    res.render('orders_view_page', { data: cartItems, datas: send, user: user,dataCat:categoryData })
  } catch (error) {
    console.log(error.message);
  }
}

const view_order_task = async (req, res) => {
  try {
    const id = req.session.user_id
    const order = await Order.find({ user_details: new mongoose.Types.ObjectId(id) })
    const send = order[0]
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



    const user = userCart

    res.render('Order_page', { data: user, er: "The order page" })
  } catch (error) {
    console.log(error.message);
  }
}

const Order_setup = async (req, res) => {
  try {
    const id = req.query.id;


    const order = await Order.find({ _id: new mongoose.Types.ObjectId(id) })
    const send = order[0]

    const userCart = await Order.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
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

    console.log("------------------------------", cartItems, "----------------------------------------");

    res.render('view_detailed', { data: cartItems, user: user, er: "make changes", datas: send });

  } catch (error) {
    console.log(error.message);
  }
}




const approve_order = async (req, res) => {
  try {
    const orderId = req.query.id; // Replace with the actual product ID
    const newStatus = "approved"; // Replace with the new status you want to set
    const qn =req.query.qn
    const productId = req.query.pid
    
    const fi_pr =await Product.findOne({_id:productId})
    
    const ne =fi_pr.product_quantity-qn;


    await Product.updateOne({_id:productId}, {$set:{ product_quantity: ne }});
  

    const updateResponse = await Order.updateOne(
      { _id: new mongoose.Types.ObjectId(orderId.toString()) },
      {
        $set: {
          'user_cart.products.$[product].status': newStatus,
        },
      },
      {
        arrayFilters: [{ 'product.product_id': new mongoose.Types.ObjectId(productId.toString()) }],
      }
    );

    if (updateResponse.modifiedCount === 0) {
      console.log('No order or product found');
    } else {
      console.log('Successfully modified product');
    }
    console.log(orderId + " dddd " + productId)
    res.redirect('/order_view_admin')
  }
  catch (err) {

  }
};

const delivery_set = async (req, res) => {
  try {
    const orderId = req.query.id; // Replace with the actual product ID
    const newStatus = "delivery"; // Replace with the new status you want to set

    const productId = req.query.pid

    const updateResponse = await Order.updateOne(
      { _id: new mongoose.Types.ObjectId(orderId.toString()) },
      {
        $set: {
          'user_cart.products.$[product].status': newStatus,
        },
      },
      {
        arrayFilters: [{ 'product.product_id': new mongoose.Types.ObjectId(productId.toString()) }],
      }
    );

    if (updateResponse.modifiedCount === 0) {
      console.log('No order or product found');
    } else {
      console.log('Successfully modified product');
    }
    console.log(orderId + " dddd " + productId)
    res.redirect('/order_view_admin')
  } catch (error) {
    console.log(error.message);
  }
}

const delivered_set = async (req, res) => {
  try {
    const orderId = req.query.id; // Replace with the actual product ID
    const newStatus = "delivered"; // Replace with the new status you want to set

    const productId = req.query.pid

    const updateResponse = await Order.updateOne(
      { _id: new mongoose.Types.ObjectId(orderId.toString()) },
      {
        $set: {
          'user_cart.products.$[product].status': newStatus,
        },
      },
      {
        arrayFilters: [{ 'product.product_id': new mongoose.Types.ObjectId(productId.toString()) }],
      }
    );

    if (updateResponse.modifiedCount === 0) {
      console.log('No order or product found');
    } else {
      console.log('Successfully modified product');
    }
    console.log(orderId + " dddd " + productId)
    res.redirect('/order_view_admin')
  } catch (error) {
    console.log(error.message);
  }
}


const cancel_item = async (req, res) => {
  try {
    const orderId = req.query.id; // Replace with the actual product ID
    const newStatus = "canceled"; // Replace with the new status you want to set
    const wh =req.query.wh
    const productId = req.query.pid

    const qn =req.query.qn
   
    
    const fi_pr =await Product.findOne({_id:productId})
    
    const ne =fi_pr.product_quantity+Number(qn);


    await Product.updateOne({_id:productId}, {$set:{ product_quantity: ne }});
  

    const updateResponse = await Order.updateOne(
      { _id: new mongoose.Types.ObjectId(orderId.toString()) },
      {
        $set: {
          'user_cart.products.$[product].status': newStatus,
        },
      },
      {
        arrayFilters: [{ 'product.product_id': new mongoose.Types.ObjectId(productId.toString()) }],
      }
    );

    if (updateResponse.modifiedCount === 0) {
      console.log('No order or product found');
    } else {
      console.log('Successfully modified product');
    }
    console.log(orderId + " dddd " + productId)

    if (wh==0) {
      res.redirect('/order_view_admin')
    } else {
      res.redirect('/view_order_page')
    }
    
  } catch (error) {
    console.log(error.message);
  }
}


// const cancel_item_user = async (req, res) => {
//   try {
//     const orderId = req.query.id; // Replace with the actual product ID
//     const newStatus = "canceled"; // Replace with the new status you want to set

//     const productId = req.query.pid

//     const qn =req.query.qn
   
    
//     const fi_pr =await Product.findOne({_id:productId})
    
//     const ne =Number(fi_pr.product_quantity)+Number(qn);


//     console.log("========================================",qn,fi_pr.product_quantity,ne);


//     await Product.updateOne({_id:productId}, {$set:{ product_quantity: ne }});
  

//     const updateResponse = await Order.updateOne(
//       { _id: new mongoose.Types.ObjectId(orderId.toString()) },
//       {
//         $set: {
//           'user_cart.products.$[product].status': newStatus,
//         },
//       },
//       {
//         arrayFilters: [{ 'product.product_id': new mongoose.Types.ObjectId(productId.toString()) }],
//       }
//     );

//     if (updateResponse.modifiedCount === 0) {
//       console.log(updateResponse);
//       console.log('No order or product found');
//     } else {
//       console.log('Successfully modified product');
//     }
//     console.log(orderId + " dddd " + productId)
//     res.redirect('/view_order_page')
//   } catch (error) {
//     console.log(error.message);
//   }
// }



module.exports = {
  place_order,
  load_order_view_page,
  view_order_task,
  Order_setup,
  approve_order,
  delivery_set,
  delivered_set,
  cancel_item,
  createOrder,
  orderSuccess,
  
}