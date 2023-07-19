const mongoose = require('mongoose')
const cartSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    total: {
        type: Number
    },
    products: [{
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        quantity: {
            type: Number,
            required: true
        },
        buy: {
            type:Boolean,
            default:false
        },
        status:{
            type : String,
            default:"requested"
        }
    }]
})

module.exports = mongoose.model('Cart', cartSchema)