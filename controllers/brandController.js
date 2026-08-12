const brandModel = require('../models/brandModel');
const mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
const fetchbrands = async (req, res) => {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const storeID = decoded.storeID;
        console.log("storeID in fetchbrands",storeID);
        if (!storeID) {
            return res.status(401).json({ message: 'Unauthorized', success: false });
        }
        const brands = await brandModel.find({ storeID: storeID });
        res.status(200).json({ message: 'brands fetched successfully', success: true, brands });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }

}
const addbrand = async (req, res) => {
    console.log("req.body in addbrand", req.body);
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const storeID = decoded.storeID;
    console.log("storeID in addbrand",storeID);
    if (!storeID) {
        return res.status(401).json({ message: 'Unauthorized', success: false });
    }
    if (!req.body?.name) {
        return res.status(400).json({ message: 'brand name is required', success: false });
    }
    const brand = new brandModel({
        name: req.body?.name,
        description: req.body?.description,
        image: req.body?.image,
        storeID: storeID
    });
    await brand.save();
    res.status(201).json({ message: 'brand added successfully', success: true, brand });
}
const deletebrand = async (req, res) => {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const storeID = decoded.storeID;
        if (!storeID) {
            return res.status(401).json({ message: 'Unauthorized', success: false });
        }
        const brandId = req.query.id;
        if (!brandId) {
            return res.status(400).json({ message: 'brand ID is required', success: false });
        }
        const brand = await brandModel.findByIdAndDelete(brandId);
        if (!brand) {
            return res.status(404).json({ message: 'brand not found', success: false });
        }
        res.status(200).json({ message: 'brand deleted successfully', success: true, brand });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
}
const updatebrand = async (req, res) => {
 try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const storeID = decoded.storeID;
        if (!storeID) {
            return res.status(401).json({ message: 'Unauthorized', success: false });
        }
        const brandId = req.query.id;
        if (!brandId) {
            return res.status(400).json({ message: 'brand ID is required', success: false });
        }
        const brand = await brandModel.findById(brandId);
        if (!brand) {
            return res.status(404).json({ message: 'brand not found', success: false });
        }
        const updatedData = {
            name: req.body?.name || brand.name,
            description: req.body?.description || brand.description,
            image: req.body?.image || brand.image
        };
        
        const updatedbrand = await brandModel.findByIdAndUpdate
(brandId, updatedData, { new: true });
        if (!updatedbrand) {
            return res.status(404).json({ message: 'brand not found', success: false });
        }
        res.status(200).json({ message: 'brand updated successfully', success: true, brand: updatedbrand });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
}
module.exports = {
    fetchbrands,
    addbrand,
    deletebrand,
    updatebrand
};