const express = require('express');
const settingRouter = express.Router();
const verifyToken = require('../middlewares/verifytoken');
const { fetchSettings, addCategory, addBrand } = require('../controllers/settingController');

settingRouter.get('/', verifyToken, fetchSettings);
settingRouter.post('/addCategory', verifyToken, addCategory);
settingRouter.post('/addBrand', verifyToken, addBrand);

module.exports = settingRouter