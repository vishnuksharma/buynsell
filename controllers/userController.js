const Users = require('../models/user');
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userController = {

  getRegisterPage (req, res) {
    var user = (req.session.userData)? req.session.userData : {};
    if (user.email !== undefined){
      res.redirect('/products/products');
      return false;
    }
    res.render("register", { title: "Buy & Sell - login", userData: user });
  },

  registerUser(req, res) {
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
            message: "Something went wrong please try again."+error
          });
        } else {
          res
            .status(200)
            .send({ status: 200, message: "Successfully registered" });
        }
      });
    });
  },

  getLoginPage (req, res) {
    var user = (req.session.userData)? req.session.userData : {};
    if (user.email !== undefined){
      res.redirect('/products/products');
      return false;
    }
    res.render("login", { title: "Buy & Sell - login", userData: user });
  },

  loginUser(req, res) {
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
    });
  },

  getUserProfilePage(req, res){
    var user = (req.session.userData)? req.session.userData : {};
    if (user.email === undefined){
      res.redirect('/products/products')
    }
    Users.findOne({_id: user._id} , function (err, userData){
      if (userData !== null){
        req.session.userData = userData;
        res.render("profile", { title: "Buy & Sell - account", userData: userData });          
      }else {
        res.render("login", { title: "Buy & Sell - Login", userData: user }); 
      }
  });

    
  },

  userLogout(req, res) {
    req.session.destroy();
    res.redirect("/products/products");
  },

  userDetailUpdate(req, res){
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
          Users.findOne({_id: req.body.id} , function (err, userData){
            if (userData !== null){
              req.session.userData = userData;
              res.status(200).send({ status: 200, message: "Detail successfully updated" });       
            }
          });
          
        }
      });
    });
  }


};

module.exports = userController;
