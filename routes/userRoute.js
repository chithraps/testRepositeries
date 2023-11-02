const express = require("express");

const user_rout = express();

const session = require('express-session');

const cookieParser = require('cookie-parser')

const config = require('../config/config')

user_rout.use(session({
    secret: config.sesseionSecret,
    resave: false,
    saveUninitialized: true
}));

user_rout.use(cookieParser())

const auth = require('../middlewares/auth')

const emailValidator = require('../middlewares/emailValidator')

const mobileNumValidator = require('../middlewares/phoneNumValidator');



user_rout.set('view engine', 'ejs');

user_rout.set('views', './views/user');




const userController = require("../controllers/userController");


user_rout.get('/register', auth.isLogout, userController.loadRegister);

user_rout.post('/register', emailValidator, mobileNumValidator, userController.insertUser);

user_rout.get('/', auth.isLogout, userController.loginLoad);

user_rout.get('/login', auth.isLogout, userController.loginLoad);

user_rout.post('/login', userController.verifyLogin);

user_rout.get('/home', auth.isLogin, userController.loadHome);

user_rout.get('/logout',auth.isLogin,userController.userLogout)


module.exports = user_rout;