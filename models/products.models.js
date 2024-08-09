const { required, number } = require('joi');
const mongoose = require('mongoose');

let requiredField = "The field is required";
const productsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, requiredField]
        }, 

        quantity: {
            type: Number,
            required: [true, requiredField],
            default: 0
        },

        price: {
            type: Number,
            required: true,
            default: 0,

        },

        image: {
            type: String,
            required: false,
        },

        category: {
            type: String,
            required: false,
            default: 'Others'   
        },
        purchased: {
            type: Number,
            required: false,

        }

    },

    {
        timestamps: true
    }
);

const  salesSchema = new mongoose.Schema(
    {
        
        productId: {
            type: String,

        },
        quantity: {
            type: String
        },
        
        
    },
   { timestamps: true}
);

const product = mongoose.model('products', productsSchema);
const sales = mongoose.model('sales', salesSchema);

module.exports = {product, sales};


