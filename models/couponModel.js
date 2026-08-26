const mongoose = require('mongoose');
const couponSchema = new mongoose.Schema({
    storeID: { type: mongoose.Schema.Types.ObjectId, ref: 'store', required: true },
    couponName: { type: String, required: true },
    couponCode: { type: String, required: true },
    discountPercentage: { type: Number, required: true },
    expirationDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    usedtimes: { type: Number, default: 0 },
    maxUsage: { type: Number, default: 1 },
    status: { type: String, enum: ['active', 'expired', 'used'], default: 'active' }
},
    { timestamps: true });
couponSchema.set('collection', 'coupons');
const couponModel = mongoose.model('coupon', couponSchema);
module.exports = couponModel;