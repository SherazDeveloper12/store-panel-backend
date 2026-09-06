const mongoose = require('mongoose');
const couponModel = require('../models/couponModel');
const jwt = require('jsonwebtoken');
const createcoupon = async (req, res) => {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const storeID = decoded.storeID;
        console.log("storeID in fetchbrands", storeID);
        if (!storeID) {
            return res.status(401).json({ message: 'Unauthorized', success: false });
        }
        const { couponName, couponCode, discountPercentage, expirationDate, maxUsage, } = req.body;
        if (!couponName || !couponCode || !discountPercentage || !expirationDate || !maxUsage) {
            return res.status(400).json({ message: 'All fields are required', success: false });
        }
        const newCoupon = new couponModel({
            couponName,
            couponCode,
            discountPercentage,
            expirationDate,
            maxUsage,
            storeID
        });
        const savedCoupon = await newCoupon.save();
        res.status(201).json({ message: 'Coupon created successfully', success: true, coupon: savedCoupon });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error creating coupon", error: error });
    }
}
const updatecoupon = async (req, res) => {
    try {
 const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const storeID = decoded.storeID;
        if (!storeID) {
            return res.status(401).json({ message: 'Unauthorized', success: false });
        }

        const {couponId} = req.params;
        console.log("Updating coupon with id:", couponId);
        const updatedData = req.body;
        const updatedcoupon = await couponModel.findByIdAndUpdate(couponId, updatedData, { new: true });
        if (!updatedcoupon) {
            return res.status(404).json({ message: 'coupon not found', success: false });
        }
        res.status(200).json({ message: 'coupon updated successfully', success: true,  updatedcoupon });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
}

const deletecoupon = async (req, res) => {
    try {
         const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const storeID = decoded.storeID;
        if (!storeID) {
            return res.status(401).json({ message: 'Unauthorized', success: false });
        }

        const {couponId} = req.params;
        console.log("Deleting coupon with id:", couponId);
        const id = couponId;
        const deletedcoupon = await couponModel.findByIdAndDelete(id);
        if (!deletedcoupon) {
            return res.status(404).json({ message: 'coupon not found' });
        }
        res.status(200).json({ message: 'coupon deleted successfully', deletedcoupon });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
}

const getAllcoupons = async (req, res) => {
    try {
        console.log('Fetching all coupons for storeID:', req.query.storeID);
        const storeID = req.query.storeID; // Get storeID from query parameters
        console.log('storeID:', storeID);
        if (!storeID) {
            return res.status(400).json({ message: 'storeID query parameter is required' });
        }
        const coupons = await couponModel.find({ storeID });

        res.status(200).json(coupons);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const validateCoupon = async (req, res) => {}
const getcouponById = async (req, res) => {
}
module.exports = { createcoupon, updatecoupon, deletecoupon, getAllcoupons, getcouponById };