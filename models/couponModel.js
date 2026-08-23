const mongoose = require('mongoose');
const couponSchema = new mongoose.Schema({
    couponCode: { type: String, required: true },
    discountPercentage: { type: Number, required: true },
    expirationDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    usedtimes: { type: Number, default: 0 },
},
    { timestamps: true });
couponSchema.set('collection', 'coupons');
const couponModel = mongoose.model('coupon', couponSchema);
module.exports = couponModel;