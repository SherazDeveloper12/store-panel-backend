const mongoose = require('mongoose');
const authSchema = new mongoose.Schema({
    userName: { type: String, required: true,  },
    storeName: { type: String, required: true,  },
    storeID: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    storeURL: { type: String,  unique: true },
    storeDeliveryCharges: { type: Number, default: 0 },
    storePaymentMethods: { type: [Object], default: [{ name: 'Cash on Delivery', enabled: true }] },
    password: { type: String, required: true },
    profilePic: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isAuthenticated: { type: Boolean, default: false }
},
    { timestamps: true });
authSchema.set('collection', 'users');
const authModel = mongoose.model('Auth', authSchema);
module.exports = authModel;