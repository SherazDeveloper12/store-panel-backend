const express = require('express');
const couponRouter = express.Router();
const verifyToken = require('../middlewares/verifytoken');
const { 
   createcoupon, updatecoupon, deletecoupon, getAllcoupons, getcouponById
} = require('../controllers/CouponController');

couponRouter.get('/', getAllcoupons);
couponRouter.post('/create', verifyToken, createcoupon);
couponRouter.put('/update/:couponId', verifyToken, updatecoupon);
couponRouter.delete('/delete/:couponId', verifyToken, deletecoupon);

module.exports = couponRouter;