var express = require("express");
var router = express.Router();
var Products = require("../models/products");

var productController = require('../controllers/productController');


router.get('/products', productController.getProductsPage);

router.get('/productdetail/:id', productController.getProductDetailPage);

router.get('/buy/:id', productController.getBuyProductPage);

router.get('/confirm/:id', productController.getConfirmProductPage);

router.get('/add', productController.getAddProductPage);

router.post('/add', productController.saveProduct);

router.get('/myproducts', productController.getMyProductPage);

router.get('/purchased', productController.getPurchasedPage);

router.get('/buyingrecords', productController.getBuyingRecordsPage);

router.get('/transhistory', productController.getAdminTransHistory);

module.exports = router;