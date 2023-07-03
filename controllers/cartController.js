const Category = require('../models/categoriesModel')
const User = require('../models/userModel')
const Product = require('../models/productModel')
const Cart=require('../models/cartModel');


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
  const cartItems = userCart.map(cartItem => ({
    details: cartItem.product_details,
    quantity: cartItem.products.find(product => product.product_id.toString() === cartItem.product_details._id.toString()).quantity
  }));

  console.log("Cart Items:", cartItems);

  res.render('cartView', { er: "success", data: cartItems });
};

const update_cart_item = async (req, res) => {
  console.log(req.body);
  res.send({isOk: true, quantity: req.body.quantity});
}





module.exports = {
  load_addtocart,
  load_Cart_view_user,
  update_cart_item,
}