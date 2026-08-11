const mongoose = require('mongoose');
const settingSchema = new mongoose.Schema({
    categories: { type: Array, default: [] },
    brands: { type: Array, default: [] },
    storeID: { type: String, required: true, unique: true },
}, { timestamps: true });
const settingModel = mongoose.model('Setting', settingSchema);

module.exports = settingModel;