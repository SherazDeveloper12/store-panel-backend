const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    storeID: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true }
},

    { timestamps: true });

categorySchema.set('collection', 'category');
const categoryModel = mongoose.model('Category', categorySchema);
module.exports = categoryModel;