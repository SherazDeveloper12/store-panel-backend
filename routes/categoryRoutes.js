
const express = require('express');
const categoryRouter = express.Router();
const verifyToken = require('../middlewares/verifytoken');
const { fetchCategories, addCategory, deleteCategory, updateCategory } = require('../controllers/categoryController');
categoryRouter.get('/', verifyToken, fetchCategories);
categoryRouter.post('/addCategory', verifyToken, addCategory);
categoryRouter.delete('/deleteCategory', verifyToken, deleteCategory);
categoryRouter.post('/updateCategory', verifyToken, updateCategory);

module.exports = categoryRouter