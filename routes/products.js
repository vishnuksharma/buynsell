var express = require("express");
var router = express.Router();
var Products = require("../models/products");


router.get('/products', function(req, res, next) {
  console.log(req.session.userData, 'session');
  var user = (req.session.userData)? req.session.userData : {};
  Products.find({}, function (error, productlist) {  
    res.render('products', { title: 'Buy & Sell - Product Listing', userData: user, productList: productlist });
  });
});

router.get('/add', function(req, res, next) {
  var user = (req.session.userData)? req.session.userData : {};
  if (user.email === undefined){
    res.redirect('/products/products')
  }
  res.render('addproduct', { title: 'Buy & Sell - Add Product', userData: user });
});

router.post('/add', function(req, res, next) {
  var user = (req.session.userData)? req.session.userData : {};
  if (user.email === undefined){
    res.redirect('/products/products')
  }
  const product = new Products(req.body);
  product.save(error => {
      if (error) {
        res.send({
          statuscode: 503,
          status: "error",
          message: "Something went wrong please try again."
        });
      } else {
        res
          .status(200)
          .send({ status: 200, message: "Product successfully saved." });
      }
    });
});

router.get('/myproducts', function(req, res, next) {
  var user = (req.session.userData)? req.session.userData : {};
  if (user.email === undefined){
    res.redirect('/products/products')
  }
  Products.find({userid: user._id}, function (error, productlist) {
    // console.log(productlist);
    res.render('myproducts', { title: 'Buy & Sell - Product Listing', userData: user, myproductList: productlist });
  });
  
});

module.exports = router;