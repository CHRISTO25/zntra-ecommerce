const Category = require('../models/categoriesModel')
const User = require('../models/userModel')
const Product = require('../models/productModel')
const Cart = require('../models/cartModel');
const mongoose = require('mongoose');


const load_addtocart = async (req, res) => {
  try {
    const userData = req.session.cartUser;
    // const productId = req.query.id;



    let prodId = req.query.id
    let userId = userData._id;
    let userCart = await Cart.findOne({ user_id: userId })
    if (!userCart) {
      const newCart = new Cart({ user_id: userId, products: [] })
      await newCart.save()
      userCart = newCart
    }
    const productIndex = userCart?.products.findIndex((product) => product.product_id == prodId)
    const item = await Product.find({ _id: prodId })
    if (productIndex == -1) {
      userCart.products.push({ product_id: prodId, quantity: 1, price: item[0].price })

    } else {
      userCart.products[productIndex].quantity += 1


    }
    await userCart.save()
    setTimeout(() => {
      res.redirect('/home')
    }, 1000)

  } catch (error) {
    console.log(error.message);
    res.status(500).send('Internal Server Error');
  }
};


const load_Cart_view_user = async (req, res) => {
  const id = req.session.user_id;
  console.log(id);

  const userCart = await Cart.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "products.product_id",
        foreignField: "_id",
        as: "product_details"
      }
    },
    { $unwind: "$product_details" },
  ]);

  // Access product details and quantity
  const filteredData = userCart.filter(item => item.user_id.toString() === id.toString());
  const cartItems = filteredData.map(cartItem => ({

    details: cartItem.product_details,
    quantity: cartItem.products.find(product => product.product_id.toString() === cartItem.product_details._id.toString()).quantity

  }));

  const categoryData = await Category.find();

  console.log(`id: ${id}`)
  console.log("Cart Items:", cartItems);

  res.render('cartView', { er: "success", data: cartItems, dataCat: categoryData });
};


// console.log(req.body);
// res.send({isOk: true, quantity: req.body.quantity});
// console.log(req.body.quantity);
// const userData = req.session.cartUser;
// let userId = userData._id;
const update_cart_item = async (req, res) => {

  const productId = req.body.id

  const check =await Product.findOne({_id:productId})


  const userData = req.session.cartUser;
  let userId = userData._id;
  const newQuantity = req.body.quantity
  console.log(check,"check------------------------------------------",newQuantity);
  const cart = await Cart.findOne({ user_id: userId })
  if (!cart) {
    // Cart not found
    return { success: false, message: 'Cart not found' };
  }

  if (newQuantity<=check.product_quantity) {
    
  
  // Find the index of the product in the products array
  const productIndex = cart.products.findIndex(product => product.product_id.equals(productId));
  if (productIndex === -1) {
    // Product not found in the cart
    return { success: false, message: 'Product not found in the cart' };
  }

  // Update the quantity of the product
  cart.products[productIndex].quantity = newQuantity;
  console.log("sssssssssssssssssssssssssssssssssssssssss");
  // Save the updated cart
  await cart.save();
}
else{
  
}

}

const loadcheckout_page = async (req, res) => {
  try {

    const total = req.query.full_total;
    const id = req.session.user_id;
    // console.log("======================",total);

    const userCart = await Cart.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "products.product_id",
          foreignField: "_id",
          as: "product_details"
        }
      },
      { $unwind: "$product_details" },
    ]);

    // Access product details and quantity
    const filteredData = userCart.filter(item => item.user_id.toString() === id.toString());
    const cartItems = filteredData.map(cartItem => ({

      details: cartItem.product_details,
      quantity: cartItem.products.find(product => product.product_id.toString() === cartItem.product_details._id.toString()).quantity

    }));
    const user_data = await User.find({ _id: id })
    // console.log("details ====== ",id);
    // console.log(user_data);
    const users = user_data[0]

    // console.log("Cart Items:", cartItems);

    const categoryData = await Category.find();

    res.render('checkout', { er: "success", data: cartItems, datas: users, total: total, dataCat: categoryData })
  } catch (error) {
    console.log(error.message);
  }
}

const load_remove_from_cart = async (req, res) => {
  try {
    // Assuming you have a cartId parameter in your query
    const productId = req.query.id; // Assuming you have a productId parameter in your query

    const userData = req.session.cartUser;
    let userId = userData._id;

    const cart = await Cart.findOne({ user_id: userId })

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the index of the product in the cart's products array
    const productIndex = cart.products.findIndex(
      (product) => product.product_id.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    // Remove the product from the cart's products array
    cart.products.splice(productIndex, 1);

    // Save the updated cart
    await cart.save();

    res.redirect('/load_cart'); // Redirect to the desired page after successful removal
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};




module.exports = {
  load_addtocart,
  load_Cart_view_user,
  update_cart_item,
  loadcheckout_page,
  load_remove_from_cart
}