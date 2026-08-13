const mongoose = require('mongoose');
const productModel = require('../models/productmodel');
const jwt = require('jsonwebtoken');
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