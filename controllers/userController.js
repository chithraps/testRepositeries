const user = require("../models/userModel")

const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer');
const validateEmail = require("../middlewares/emailValidator");
const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash

    } catch (error) {
        console.log(error.message);
    }

}



const loadRegister = async (req, res) => {
    try {

        res.render("userRegistration");

    } catch (error) {
        console.log(error.message);
    }
}

const insertUser = async (req, res) => {
    try {
        const spassword = await securePassword(req.body.password);
        const uemail = req.body.email;
        const userExits = await user.findOne({ email: uemail })
        console.log(userExits)
        if(userExits){
            res.render('userRegistration', { message: "Email already exists" });
        }else{
            const userData = new user({
                name: req.body.uname,
                email: req.body.email,
                mobile: req.body.mobile,
                username: req.body.username,
                password: spassword,
                is_admin: 0
    
            });        
    
            const userDetails = await userData.save();
            if (userDetails) {
    
                res.render('userRegistration', { message: "Your sign up has been successfully completed" });
            } else {
                res.render('userRegistration', { message: "Your registration has been failed" });
            }
    
        }

        
    } catch (error) {
        console.log(error.message)
    }
}

const loginLoad = async (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message)
    }

}

const verifyLogin = async (req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;

        const userData = await user.findOne({ email: email });
        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if (passwordMatch) {
                req.session.user_id = userData._id;
                req.session.name = userData.name;
                req.session.email = userData.email;
                req.session.mobile = userData.mobile;
                res.redirect('/home')
            } else {
                res.render('login', { message: "Email or password is incorrect" });
            }
        } else {
            res.render('login', { message: "Email or password is incorrect" });
        }
    } catch (error) {
        console.log(error.message)
    }
}

const loadHome = async (req, res) => {
    try {
        const userDatas = {
            name: req.session.name,
            email: req.session.email,
            mobile: req.session.mobile
        }
        res.render('home', { userDatas: userDatas })
    } catch (error) {
        console.log(error.message)
    }
}

const userLogout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/');

    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout
}