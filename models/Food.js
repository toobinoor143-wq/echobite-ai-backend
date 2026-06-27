const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

     sizes: [
        {
            size: String,
            price: Number
        }
    ],

    category: {
        type: String,
        required: true
    },

    image: {
        type: String
    },

    rating: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

module.exports = mongoose.models.Food || mongoose.model('Food', foodSchema);