const Products = require('../models/products');
const BuyingRecords = require('../models/buyingrecords');
const Users = require('../models/user');

const userController = {

  getProductsPage (req, res) {
    var user = (req.session.userData)? req.session.userData : {};
    Products.find({status: 'active', 'userid': {$ne : user._id}}, function (error, productlist) {  
      res.render('products', { title: 'Buy & Sell - Product Listing', userData: user, productList: productlist });
    });
  },

  getProductDetailPage(req, res) {
    var user = (req.session.userData)? req.session.userData : {};
    console.log(req.params.id)
    Products.find({_id: req.params.id}, function (error, productDetail) { 
      if(productDetail && productDetail.length > 0){
        res.render('productdetail', { title: 'Buy & Sell - Product Detail', userData: user, productDetail: productDetail });
      } else {
        res.redirect('/products/products');
      }
    });
  },

  getBuyProductPage(req, res){
    var user = (req.session.userData)? req.session.userData : {};
    var lessBalance = 'no';
    if (user._id === undefined){
      res.redirect('/users/login')
      return false;
    }
    Products.find({_id: req.params.id}, function (error, productDetail) { 
      if(productDetail && productDetail.length > 0){
        console.log(user.money, '=====', productDetail[0].price);
        if (parseInt(user.money) < parseInt(productDetail[0].price)){
          lessBalance = 'yes';
        }
        res.render('buyproduct', { title: 'Buy & Sell - Product Buy', userData: user, productDetail: productDetail, lessBalance: lessBalance });
      } else {
        res.redirect('/products/products');
      }
    });
  },

  getAddProductPage(req, res){
    var user = (req.session.userData)? req.session.userData : {};
    if (user.email === undefined || (user && user.usertype !== 'seller') ){
      res.redirect('/products/products');
      return false;
    }
    res.render('addproduct', { title: 'Buy & Sell - Add Product', userData: user });
  },

  saveProduct(req, res) {
    var user = (req.session.userData)? req.session.userData : {};
    if (user.email === undefined){
      res.redirect('/products/products');
      return false;
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
  },

  getMyProductPage(req, res) {
    var user = (req.session.userData)? req.session.userData : {};
    if (user.email === undefined || (user && user.usertype !== 'seller') ){
      res.redirect('/products/products');
      return false;
    }
    Products.find({userid: user._id, status: {$ne : 'sold'}}, function (error, productlist) {
      res.render('myproducts', { title: 'Buy & Sell - Product Listing', userData: user, myproductList: productlist });
    });
  },

  getPurchasedPage (req, res){
    var user = (req.session.userData)? req.session.userData : {};
    if (user.email === undefined){
      res.redirect('/products/products');
      return false;
    }
    Products.find({userid: user._id, status: 'sold'}, function (error, productlist) {
      res.render('purchased', { title: 'Buy & Sell - Product Listing', userData: user, myproductList: productlist });
    });
  },

  getConfirmProductPage(req, res) {
    var user = (req.session.userData)? req.session.userData : {};
    if (user._id === undefined){
      res.redirect('/users/login');
      return false;
    }
    
    Products.find({_id: req.params.id}, function (error, productDetail) {
      if(productDetail && productDetail.length > 0){
        var prodPrice = parseInt(productDetail[0].price);
        Users.find({_id: productDetail[0].userid}, (error, userDetails) => {
          if (error){
            res.redirect('/products/products');
          } else {
            var buyingRecData = {
              userid: user._id, productid: req.params.id, 
              prodname: productDetail[0].title, boughtby: user.fname,
              prodprice: prodPrice, soldby: userDetails[0].fname,
              }

              var finalMoney = parseInt(user.money) - parseInt(prodPrice);
        
              Users.findOneAndUpdate({_id: user._id}, {money: finalMoney, $inc : {'rating' : 1}}, error => {
                if (error){
                  res.redirect('/products/products');
                } else {
                  req.session.userData.money = finalMoney;
                  // direct update without fees
                  if (prodPrice <= 5) {              
                    Users
                    .findOneAndUpdate({_id: productDetail[0].userid}, {$inc : {'money' : prodPrice}})
                    .exec();
                    Products.findOneAndUpdate({_id: req.params.id}, {status: 'sold'}).exec();
                    buyingRecData.adminfees = 0;
                    buyingRecData.feesper = 0;
                    buyingRecData.prodownermoney = prodPrice;
                    const buyingRec = new BuyingRecords(buyingRecData);
                    buyingRec.save();
                  } 
                  // admin fees 5% included
                  else if (prodPrice > 5 && prodPrice <= 100){
                    var fees = Math.ceil((prodPrice*5)/100);
                    prodOwnerAmt = (prodPrice-fees);
                    Users
                    .findOneAndUpdate({_id: productDetail[0].userid}, {$inc : {'money' : prodOwnerAmt}})
                    .exec();
                    Users
                    .findOneAndUpdate({usertype: 'admin'}, {$inc : {'money' : fees}})
                    .exec();
                    Products.findOneAndUpdate({_id: req.params.id}, {status: 'sold'}).exec();
                    buyingRecData.adminfees = fees;
                    buyingRecData.feesper = 5;
                    buyingRecData.prodownermoney = prodOwnerAmt;
                    const buyingRec = new BuyingRecords(buyingRecData);
                    buyingRec.save();
                  } // admin fees 10% included
                  else if (prodPrice > 100 && prodPrice <= 1000){
                    var fees = Math.ceil((prodPrice*10)/100);
                    var prodOwnerAmt = (prodPrice-fees);
                    Users
                    .findOneAndUpdate({_id: productDetail[0].userid}, {$inc : {'money' : prodOwnerAmt}})
                    .exec();
                    Users
                    .findOneAndUpdate({usertype: 'admin'}, {$inc : {'money' : fees}})
                    .exec();
                    Products.findOneAndUpdate({_id: req.params.id}, {status: 'sold'}).exec();
                    buyingRecData.adminfees = fees;
                    buyingRecData.feesper = 10;
                    buyingRecData.prodownermoney = prodOwnerAmt;
                    const buyingRec = new BuyingRecords(buyingRecData);
                    buyingRec.save();
                  } // admin fees 15% included
                  else if (prodPrice > 1000){
                    var fees = Math.ceil((prodPrice*15)/100);
                    var prodOwnerAmt = (prodPrice-fees);
                    Users
                    .findOneAndUpdate({_id: productDetail[0].userid}, {$inc : {'money' : prodOwnerAmt}})
                    .exec();
                    Users
                    .findOneAndUpdate({usertype: 'admin'}, {$inc : {'money' : fees}})
                    .exec();
                    Products.findOneAndUpdate({_id: req.params.id}, {status: 'sold'}).exec();

                    buyingRecData.adminfees = fees;
                    buyingRecData.feesper = 15;
                    buyingRecData.prodownermoney = prodOwnerAmt;
                    const buyingRec = new BuyingRecords(buyingRecData);
                    buyingRec.save();
                  }
                }
              });
          }
        });


        res.render('successpay', { title: 'Buy & Sell - Product Buy', userData: user, productDetail: productDetail });
      } else {
        res.redirect('/products/products');
      }
    });
  },

  getBuyingRecordsPage(req, res) {
    var user = (req.session.userData)? req.session.userData : {};
    if (user._id === undefined){
      res.redirect('/users/login')
    }

    BuyingRecords.find({'userid': user._id}, function (error, buyingList) {      
      res.render('buyingrecords', { title: 'Buy & Sell - Buying Records', userData: user, buyingList: buyingList });
    });

  },
  
  getAdminTransHistory(req, res){
    var user = (req.session.userData)? req.session.userData : {};
    if (user._id === undefined && user.usertype !== 'admin'){
      req.session.destroy();
      res.redirect('/users/login')
    }

    BuyingRecords.find({}, function (error, transList) {      
      res.render('admintransactionhistory', { title: 'Buy & Sell - Buying Records', userData: user, transList: transList });
    });
  },

  dateFormate(date){
    var newDate = new Date(date);
    var d = newDate.getDate();
    var m = newDate.getMonth();
    var y = newDate.getFullYear();
    var hour = newDate.getHours();
    var min = newDate.getMinutes();
    var sec = newDate.getSeconds();

    return `${d}-${m}-${y} ${hour}:${min}:${sec}`;
  }


};

module.exports = userController;
