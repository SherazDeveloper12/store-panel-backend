const categoryModel = require('../models/categoryModel');
const mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
const fetchCategories = async (req, res) => {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const storeID = decoded.storeID;
        console.log("storeID in fetchCategories",storeID);
        if (!storeID) {
            return res.status(401).json({ message: 'Unauthorized', success: false });
        }
        const categories = await categoryModel.find({ storeID: storeID });
        res.status(200).json({ message: 'Categories fetched successfully', success: true, categories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }

}
const addCategory = async (req, res) => {
    console.log("req.body in addCategory", req.body);
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const storeID = decoded.storeID;
    console.log("storeID in addCategory",storeID);
    if (!storeID) {
        return res.status(401).json({ message: 'Unauthorized', success: false });
    }
    if (!req.body?.name) {
        return res.status(400).json({ message: 'Category name is required', success: false });
    }
    const category = new categoryModel({
        name: req.body?.name,
        description: req.body?.description,
        image: req.body?.image,
        storeID: storeID
    });
    await category.save();
    res.status(201).json({ message: 'Category added successfully', success: true, category });
}
const deleteCategory = async (req, res) => {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const storeID = decoded.storeID;
        if (!storeID) {
            return res.status(401).json({ message: 'Unauthorized', success: false });
        }
        const categoryId = req.query.id;
        if (!categoryId) {
            return res.status(400).json({ message: 'Category ID is required', success: false });
        }
        const category = await categoryModel.findByIdAndDelete(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found', success: false });
        }
        res.status(200).json({ message: 'Category deleted successfully', success: true, category });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
}
const updateCategory = async (req, res) => {
 try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const storeID = decoded.storeID;
        if (!storeID) {
            return res.status(401).json({ message: 'Unauthorized', success: false });
        }
        const categoryId = req.query.id;
        if (!categoryId) {
            return res.status(400).json({ message: 'Category ID is required', success: false });
        }
        const category = await categoryModel.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found', success: false });
        }
        const updatedData = {
            name: req.body?.name || category.name,
            description: req.body?.description || category.description,
            image: req.body?.image || category.image
        };
        
        const updatedCategory = await categoryModel.findByIdAndUpdate
(categoryId, updatedData, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found', success: false });
        }
        res.status(200).json({ message: 'Category updated successfully', success: true, category: updatedCategory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
}
module.exports = {
    fetchCategories,
    addCategory,
    deleteCategory,
    updateCategory
};