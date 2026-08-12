const mongoose = require('mongoose');
const brandSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    storeID: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true }
},

    { timestamps: true });

brandSchema.set('collection', 'brand');
const brandModel = mongoose.model('brand', brandSchema);
module.exports = brandModel;