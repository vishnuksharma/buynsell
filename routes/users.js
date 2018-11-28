var express = require("express");
var router = express.Router();
var Users = require("../models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const myPlaintextPassword = "s0//P4$$w0rD";
const someOtherPlaintextPassword = "not_bacon";

/* GET users listing. */
router.get("/login", function(req, res, next) {
  console.log("login");
  var user = (req.session.userData)? req.session.userData : {};
  if (user.email !== undefined){
    res.redirect('/products/products')
  }
  res.render("login", { title: "Buy & Sell - login", userData: user });
});

router.get("/register", function(req, res, next) {
  var user = (req.session.userData)? req.session.userData : {};
  if (user.email !== undefined){
    res.redirect('/products/products')
  }
  res.render("register", { title: "Buy & Sell - login", userData: user });
});

router.get("/account", function(req, res, next) {
  var user = (req.session.userData)? req.session.userData : {};
  if (user.email === undefined){
    res.redirect('/products/products')
  }
  res.render("account", { title: "Buy & Sell - account", userData: user });
});

router.get("/profile", function(req, res, next) {
  var user = (req.session.userData)? req.session.userData : {};
  if (user.email === undefined){
    res.redirect('/products/products')
  }
  res.render("profile", { title: "Buy & Sell - account", userData: user });
});

router.get("/logout", function(req, res, next) {
  req.session.destroy();
  res.redirect("/products/products");
});

router.post("/login", function(req, res, next) {
  console.log(req.body);
  const formDetail = req.body;
  Users.findOne({email: formDetail.email} , function (err, userData){
      if (userData !== null){
        bcrypt.compare(formDetail.password, userData.password, function(err, flag) {
          if (flag){
            req.session.userData = userData;
            res.send ({status: 200, message: 'Login Successfully!!'});
          } else {
            res.send ({status: 201, message: 'Invalid Email/Password!!'});
          }
        });
      }else {
          res.send({status: 'error', message: 'Invalid Email Address'});
      }
  })
});

router.post("/register", function(req, res, next) {
  console.log(req.body);
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    req.body.password = hash;

    const user = new Users(req.body);
    user.save(error => {
      console.log(error);
      if (error && error.code === 11000) {
        res.send({
          statuscode: 503,
          status: "error",
          message: "Email already exist."
        });
      } else if (error !== null && error.code !== 11000) {
        res.send({
          statuscode: 503,
          status: "error",
          message: "Something went wrong please try again."
        });
      } else {
        res
          .status(200)
          .send({ status: 200, message: "Successfully registered" });
      }
    });
  });

});

router.post("/userupdate/:id", function(req, res, next) {
  console.log(req.body);
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    req.body.password = hash;

    Users.findOneAndUpdate({_id: req.body.id}, req.body, error => {
      console.log(error);
      if (error && error.code === 11000) {
        res.send({
          status: 503,
          message: "Email already exist."
        });
      } else if (error !== null && error.code !== 11000) {
        res.send({
          status: 503,
          message: "Something went wrong please try again."
        });
      } else {
        res
          .status(200)
          .send({ status: 200, message: "Detail successfully updated" });
      }
    });
  });

});

module.exports = router;
