const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    
    title: { type: String, required: true },
    heading: { type: String, required: true  },
    description: { type: String, required: true },
    brand: { type: String, },
    category: { type: String,  },
    price: { type: Number, required: true },
    rating: { type: Number, required: true },
    img: { type: Array, },
    newArrival: { type: Boolean, },
    freeShipping: { type: Boolean,  },
    orders: { type: Number,  },
    condition: { type: String, },
    inStock: { type: Boolean, default: true },
    quantity: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    storeID: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true }

});
productSchema.set('collection', 'products');
const productModel = mongoose.model('Product', productSchema);
module.exports = productModel;