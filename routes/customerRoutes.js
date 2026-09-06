const express = require('express');
const customerRouter = express.Router();
const verifyToken = require('../middlewares/verifytoken');
const { 
   contactCustomer,  getAllcustomers, 
} = require('../controllers/customerController');

customerRouter.get('/', verifyToken, getAllcustomers);
customerRouter.post('/contactCustomer', verifyToken, contactCustomer);


module.exports = customerRouter;