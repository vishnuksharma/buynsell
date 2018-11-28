var express = require('express');
var router = express.Router();
var Products = require('../models/products');

/* GET home page. */
router.get('/', function(req, res, next) {
  var user = (req.session.userData)? req.session.userData : {};
  Products.find({}, function (error, productlist) {  
    res.render('products', { title: 'Buy & Sell - Product Listing', userData: user, productList: productlist });
  });
  // res.render('products', { title: 'Buy & Sell', userData: user, productList: productList });
});

module.exports = router;
