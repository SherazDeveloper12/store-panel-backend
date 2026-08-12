const express = require('express');
const settingRouter = express.Router();
const verifyToken = require('../middlewares/verifytoken');
const { fetchSettings, addCategory, addBrand,deleteCategory, updateCategory, updateBrand, deleteBrand } = require('../controllers/settingController');

settingRouter.get('/', verifyToken, fetchSettings);

settingRouter.post('/updateBrand', verifyToken, updateBrand);
settingRouter.post('/deleteBrand', verifyToken, deleteBrand);
settingRouter.post('/addBrand', verifyToken, addBrand);

module.exports = settingRouter