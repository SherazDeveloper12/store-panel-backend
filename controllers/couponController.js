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
        res.status(500).json({ message: "Error creating coupon", error: error });
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

        const { couponId } = req.params;
        console.log("Updating coupon with id:", couponId);
        const updatedData = req.body;
        const updatedcoupon = await couponModel.findByIdAndUpdate(couponId, updatedData, { new: true });
        if (!updatedcoupon) {
            return res.status(404).json({ message: 'coupon not found', success: false });
        }
        res.status(200).json({ message: 'coupon updated successfully', success: true, updatedcoupon });

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

        const { couponId } = req.params;
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
const validateCoupon = async (req, res) => {
    try {
        const { couponCode } = req.body;
        console.log("Validating coupon with code:", couponCode);
        const coupon = await couponModel.findOne({  couponCode });
        if (!coupon) {
            return res.status(404).json({success: false, message: 'Coupon not found' });
        }
        if (coupon.expirationDate < new Date()) {
            return res.status(400).json({success: false, message: 'Coupon has expired' });
        }
        if (coupon.usageCount >= coupon.maxUsage) {
            return res.status(400).json({success: false, message: 'Coupon usage limit reached' });
        }
        if (!coupon.isActive) {
            return res.status(400).json({success: false, message: 'Coupon is not active' });
        }
        console.log("Coupon storeID:", coupon.storeID, "Request storeID:", req.body.storeID);
        if (!coupon.storeID.equals(req.body.storeID)) {
            return res.status(400).json({success: false, message: 'Coupon is not valid for this store' });
        }
        console.log("Coupon code from DB:", coupon.couponCode, "type of DB code:", typeof coupon.couponCode);
        console.log("Coupon code from request:", couponCode, "type of request code:", typeof couponCode);
       if(coupon.couponCode !== couponCode){
        return res.status(400).json({success: false, message: 'Coupon code does not match' });
       }

        res.status(200).json({ success: true, message: 'Coupon is valid',  discount: coupon.discountPercentage });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message, error: error });
    }
}
const getcouponById = async (req, res) => {
}
module.exports = {
    createcoupon, updatecoupon, deletecoupon,
    validateCoupon,
    getAllcoupons,
    getcouponById
};