var express = require("express");
var router = express.Router();
var Users = require("../models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userController = require('../controllers/userController');

/* GET users listing. */
router.get("/login", userController.getLoginPage);

router.get("/register", userController.getRegisterPage);

router.get("/profile", userController.getUserProfilePage);

router.get("/logout", userController.userLogout);

router.post("/login", userController.loginUser);

router.post("/register", userController.registerUser);

router.post("/userupdate/:id", userController.userDetailUpdate);

module.exports = router;
