const express = require('express');
const productRouter = express.Router();
const { getAllProducts, getProductById, createProduct,deleteProduct,updateProduct} = require('../controllers/productController');
const verifyToken = require('../middlewares/verifytoken');

// Route to get all products
productRouter.get('/', getAllProducts);
// Route to get a product by ID
productRouter.get('/products/:id', getProductById);
// Route to create a new product
productRouter.post('/create', verifyToken, createProduct);
productRouter.put('/update/:id', verifyToken, updateProduct);
productRouter.delete('/delete/:id', verifyToken, deleteProduct);
// Route to update a product by ID

module.exports = productRouter;