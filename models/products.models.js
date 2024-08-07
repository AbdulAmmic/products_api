const { required, number } = require('joi');
const mongoose = require('mongoose');

let requiredField = "The field is required";
const productsSchema = mongoose.Schema(
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

    },

    {
        timestamps: true
    }
);

const product = mongoose.model('products', productsSchema);

module.exports = product;