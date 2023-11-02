const user = require('../models/userModel')
const bcrypt = require('bcrypt')

const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash

    } catch (error) {
        console.log(error.message);
    }

}

const loadLogin = async (req, res) => {
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
            const userPassword = await bcrypt.compare(password, userData.password);
            if (userPassword) {
                if (userData.is_admin === 0) {
                    res.render('login', { message: "You are not allowed to login" })
                } else {
                    req.session.user_id = userData._id;
                    res.redirect("/admin/home")
                }
            } else {
                res.render('login', { message: "email or password is incorrect" })
            }
        } else {
            res.render('login', { message: "email or password is incorrect" })
        }
    } catch (error) {
        console.log(error.message)
    }
}

const loadDashboard = async (req, res) => {
    try {
        res.render('home')
    } catch (error) {
        console.log(error.message);
    }
}

const logoutAdmin = async (req, res) => {
    try {

        req.session.destroy()
        res.redirect('/admin')
    } catch (error) {
        console.log(error.message)
    }
}

const forgetPassword = async (req, res) => {
    try {
        console.log("hello")
        res.render('forget');
    } catch (error) {
        console.log(error.message)
    }
}

const forgetverify = async (req, res) => {
    try {
        const email = req.body.email;
        const userData = await user.findOne({ email: email });
        if (userData) {
            if (userData.is_admin === 0) {
                res.render('forget', { message: "Email is incorrect" })
            } else {
                const password = req.body.password;
                const rePassword = req.body.rePassword;
                if (password === rePassword) {
                    const spassword = await securePassword(req.body.password);
                    const updatepass = await user.updateOne({ email: email }, { $set: { password: spassword } });
                    if (updatepass) {
                        res.render('forget', { message: "Password updated" })
                    } else {
                        res.render('forget', { message: "Some error occured" })
                    }
                } else {
                    res.render('forget', { message: "Passwords does not match" })
                }
            }
        } else {
            res.render('forget', { message: "Email is incorrect" })
        }
    } catch (error) {
        console.log(error.message)
    }
}

const adminDashboard = async (req, res) => {
    try {
        const userData = await user.find({ is_admin: 0 })

        res.render('displayUsers', { users: userData })
    } catch (error) {
        console.log(error.message)
    }
}
const loadCreatePage = async (req, res) => {
    try {
        res.render('createUser')
    } catch (error) {
        console.log(error.message)
    }
}

const createUser = async (req, res) => {
    try {

        const spassword = await securePassword(req.body.password);

        const uemail = req.body.email;
        const userExits = await user.find({ email: uemail })
        if(userExits){
            res.render('createUser', { message: "Email already exists" });
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
    
                res.render('createUser', { message: "Your registration has been successfully completed" });
            } else {
                res.render('createUser', { message: "Your registration has been failed" });
            } 
        }
      
        
    } catch (error) {
        console.log(error.message)
    }
}
const editUser = async (req, res) => {
    try {
        const id = req.query.id;
        const userData = await user.findById({ _id: id });
        if (userData) {
            res.render('editUser', { user: userData })
        } else {
            res.redirect('/admin/home')
        }

    } catch (error) {
        console.log(error)
    }
}
const updateUser = async (req, res) => {
    try {
        const userData = await user.findByIdAndUpdate({ _id: req.body.id }, { $set: { name: req.body.name, email: req.body.email, mobile: req.body.mobile } })

        res.redirect('/admin/home')

    } catch (error) {
        console.log(error.message)
    }
}

//delete user

const deleteUser = async(req,res)=>{
    try {
        const id= req.query.id;
       await user.deleteOne({_id:id})
       res.redirect('/admin/display')
    } catch (error) {
        console.log(error.message)
    }
}



module.exports = {
    loadLogin,
    verifyLogin,
    loadDashboard,
    logoutAdmin,
    forgetPassword,
    forgetverify,
    adminDashboard,
    loadCreatePage,
    createUser,
    editUser,
    updateUser,
    deleteUser
}     