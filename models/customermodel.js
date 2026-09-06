const mongoose = require('mongoose');
const customerSchema = new mongoose.Schema({
    uid: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String },
    phoneNumber: { type: String },
    totalOrders: { type: Number, default: 0 },
    storeID: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true }
},

    { timestamps: true });

customerSchema.set('collection', 'customer');
const customerModel = mongoose.model('customer', customerSchema);
module.exports = customerModel;