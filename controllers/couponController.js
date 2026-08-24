const mongoose = require('mongoose');
const couponModel = require('../models/couponModel');
const jwt = require('jsonwebtoken');
const createcoupon = async (req, res) => {
    try {
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
}
const updatecoupon = async (req, res) => {
    try {

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
}

const deletecoupon = async (req, res) => {
    try {
        const { id } = req.params;
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

const getcouponById = async (req, res) => {
}
module.exports = { createcoupon, updatecoupon, deletecoupon, getAllcoupons, getcouponById };