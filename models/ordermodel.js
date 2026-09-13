const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    username: { type: String, required: true },
    customerId: { type: String, ref: 'Auth', required: true },
    items: { type: Array, required: true },
    shippingAddress: {
        fullName: { type: String, required: true },
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        city: { type: String, required: true },
        stateProvince: { type: String, required: true },
        postalZipCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    billingAddress: {
        fullName: { type: String, required: true },
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        city: { type: String, required: true },
        stateProvince: { type: String, required: true },
        postalZipCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },

    status: { type: String, enum: ['Pending','Rejected', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
    deliveryCharges: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['cod', 'easypaisa', 'jazzcash', 'bank_transfer'], required: true },
    paymentReceipt: { type: String, required: function () { return this.paymentMethod !== 'cod'; } },
    couponCode: { type: String, default: null },
    couponApplied: { type: Boolean, default: false },
    couponDiscount: { type: Number, default: null },
    payableAmount: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now },
    storeID: { type: String, ref: 'Store', required: true },
},
    { timestamps: true });
orderSchema.set('collection', 'orders');

const orderModel = mongoose.model('Order', orderSchema);
module.exports = orderModel;