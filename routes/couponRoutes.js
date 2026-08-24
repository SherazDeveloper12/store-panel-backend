const express = require('express');
const couponRouter = express.Router();

const { 
   createcoupon, updatecoupon, deletecoupon, getAllcoupons, getcouponById
} = require('../controllers/CouponController');

couponRouter.get('/', getAllcoupons);
couponRouter.post('/create', createcoupon);
couponRouter.put('/update/:couponId', updatecoupon);
couponRouter.delete('/delete/:couponId', deletecoupon);

module.exports = couponRouter;