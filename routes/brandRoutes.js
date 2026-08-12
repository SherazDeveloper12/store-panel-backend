
const express = require('express');
const brandRouter = express.Router();
const verifyToken = require('../middlewares/verifytoken');
const {  addbrand, deletebrand, updatebrand, fetchbrands } = require('../controllers/brandController');
brandRouter.get('/', verifyToken, fetchbrands);
brandRouter.post('/addbrand', verifyToken, addbrand);
brandRouter.delete('/deletebrand', verifyToken, deletebrand);
brandRouter.post('/updatebrand', verifyToken, updatebrand);

module.exports = brandRouter