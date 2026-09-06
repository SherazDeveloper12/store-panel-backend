const mongoose = require('mongoose');
const productModel = require('../models/productmodel');
const jwt = require('jsonwebtoken');
const notificationModel = require('../models/notifcationmodel');
const createProduct = async (req, res) => {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        const storeID = decoded.storeID;
        console.log('Decoded storeID:', storeID);
        if (!token) {
            res.clearCookie('token');
            return res.status(401).json({ message: 'Unauthorized, Please Login Again' });
        }
        const product = new productModel({ ...req.body, storeID });
        
        const savedProduct = await product.save();
        const products = await productModel.find({ storeID });
        if (products.length === 1) {
            console.log('First product added, sending notification...');
            const Notifcation = {
                recipientid: decoded._id,
                message: `Congratulations! You have successfully added your first product to your store. Start showcasing your products and watch your business grow!`,
                type: 'Growth',
                data: { productId: savedProduct._id },
                storeID: storeID
            };
            const notificationCreated = new notificationModel(Notifcation);
            await notificationCreated.save();
        }
        else if (products.length === 5) {
            console.log('5 products added, sending notification...');
            const Notifcation = {
                recipientid: decoded._id,
                message: `Great job! You've reached a milestone by adding 5 products to your store. Keep up the momentum and continue expanding your product offerings!`,
                type: 'Growth',
                data: {  },
                storeID: storeID
            };
            const notificationCreated = new notificationModel(Notifcation);
            await notificationCreated.save();
        }
        else if (products.length === 10) {
            const Notifcation = {
                recipientid: decoded._id,
                message: `Fantastic! You've achieved a significant milestone by adding 10 products to your store. Your dedication and hard work are paying off. Keep up the great work!`,
                type: 'Growth',
                data: {  },
                storeID: storeID
            };
            const notificationCreated = new notificationModel(Notifcation);
            await notificationCreated.save();
        }
        else if (products.length === 20) {
            const Notifcation = {
                recipientid: decoded._id,
                message: `Amazing! You've reached an impressive milestone by adding 20 products to your store. Your commitment to growth and success is truly commendable. Keep pushing forward and achieving new heights!`,
                type: 'Growth',
                data: {  },
                storeID: storeID
            };
            const notificationCreated = new notificationModel(Notifcation);
            await notificationCreated.save();
        }
        else if (products.length === 50) {
            const Notifcation = {
                recipientid: decoded._id,
                message: `Incredible! You've reached an extraordinary milestone by adding 50 products to your store. Your dedication, creativity, and hard work have truly paid off. This achievement is a testament to your commitment to excellence. Keep inspiring others and reaching for even greater success!`,
                type: 'Growth',
                data: {  },
                storeID: storeID
            };
            const notificationCreated = new notificationModel(Notifcation);
            await notificationCreated.save();
        }
        res.status(200).json(savedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
}
const updateProduct = async (req, res) => {
    try {

        const { id } = req.params;
        console.log('Updating product with ID:', id);
        const updatedData = req.body;
        const updatedProduct = await productModel.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product updated successfully', updatedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await productModel.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully', deletedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
}

const getAllProducts = async (req, res) => {
    try {
        console.log('Fetching all products for storeID:', req.query.storeID);
        const storeID = req.query.storeID; // Get storeID from query parameters
        console.log('storeID:', storeID);
        if (!storeID) {
            return res.status(400).json({ message: 'storeID query parameter is required' });
        }
        const products = await productModel.find({ storeID });
      
        res.status(200).json(products);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getProductById = async (req, res) => {
}
module.exports = { deleteProduct, createProduct, getAllProducts, getProductById, updateProduct };