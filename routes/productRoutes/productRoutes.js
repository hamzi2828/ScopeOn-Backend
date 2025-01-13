const express = require('express');
const router = express.Router();
const productController = require('../../controllers/productController/productController');
const verifyToken = require('../../middleware/authMiddleware');

//Product Option
router.post('/addProductOption', verifyToken, productController.addProductOption);
router.put('/product/:productId/updateProductOption/:optionId', verifyToken, productController.updateProductOption);
router.delete('/product/:productId/deleteProductOption/:optionId', verifyToken ,productController.deleteProductOption);
router.get('/getAllProductOptions', productController.getAllProductOptions);
router.get('/product/:productId/getProductOptionById/:optionId', productController.getProductOptionById);


//Product
router.post('/createProduct', verifyToken ,productController.createProduct);
router.put('/updateProduct/:productId', verifyToken ,productController.updateProduct);
router.delete('/deleteProduct/:productId', verifyToken,productController.deleteProduct);
router.get('/getAllProducts', productController.getAllProducts);
router.get('/getProductById/:id', productController.getProductById);




module.exports = router; 
