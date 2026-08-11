const jwt = require('jsonwebtoken');
const settingModel = require('../models/settingModel');
const fetchSettings = async (req, res) => {
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
        const settings = await settingModel.findOne({ storeID });
        console.log('Fetched settings:', settings);
        if (!settings) {
            return res.status(201).json({
                message: 'Settings has not been done yet', success: true, settings: {
                    categories: [],
                    brands: [],
                    storeID: storeID
                }
            });
        }
        res.status(200).json({ message: 'Settings fetched successfully', settings, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, error: error });
    }
};
const addCategory = async (req, res) => {
    try {
        console.log('add category is running:', req.body);
        const { category } = req.body;
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        const storeID = decoded.storeID;
        console.log('Decoded storeID in updateSettings:', storeID);
        if (!token) {
            res.clearCookie('token');
            return res.status(401).json({ message: 'Unauthorized, Please Login Again' });
        }
        const existingSettings = await settingModel.findOne({ storeID });
        if (!existingSettings) {
            const newSettings = new settingModel({
                storeID,
                categories: [category],
                brands: []
            });
            await newSettings.save();
            return res.status(200).json({ message: 'Settings created successfully', settings: newSettings, success: true });
        }
        const newcategories = existingSettings.categories;
        newcategories.push(category);
        const updatedSettings = await settingModel.findByIdAndUpdate(existingSettings._id, { categories: newcategories }, { new: true });
        if (!updatedSettings) {
            return res.status(404).json({ message: 'Settings not found' });
        }

        res.status(200).json({ message: 'Settings updated successfully', updatedSettings, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, error: error });
    }
};
const addBrand = async (req, res) => {
    try {
        console.log('add brand is running:', req.body);
        const { brand } = req.body;
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        const storeID = decoded.storeID;
        console.log('Decoded storeID in updateSettings:', storeID);
        if (!token) {
            res.clearCookie('token');
            return res.status(401).json({ message: 'Unauthorized, Please Login Again' });
        }
        const existingSettings = await settingModel.findOne({ storeID });
        if (!existingSettings) {
            const newSettings = new settingModel({
                storeID,
                categories: [],
                brands: [brand]
            });
            await newSettings.save();
            return res.status(200).json({ message: 'Settings created successfully', settings: newSettings, success: true });
        }
        const newbrands = existingSettings.brands;
        newbrands.push(brand);
        const updatedSettings = await settingModel.findByIdAndUpdate(existingSettings._id, { brands: newbrands }, { new: true });
        if (!updatedSettings) {
            return res.status(404).json({ message: 'Settings not found' });
        }

        res.status(200).json({ message: 'Settings updated successfully', updatedSettings, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, error: error });
    }
};


module.exports = { fetchSettings, addCategory, addBrand };