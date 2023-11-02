const express = require('express')
const admin_Route = express();

const session = require('express-session')
const config = require("../config/config")
admin_Route.use(session({
    secret: config.sesseionSecret,
    resave: false,
    saveUninitialized: true
}))


admin_Route.set('view engine', 'ejs')

admin_Route.set('views', './views/admin')
const adminAuth = require('../middlewares/adminAuth')

const emailValidator = require('../middlewares/emailValidator')

const mobileNumValidator = require('../middlewares/phoneNumValidator');

const adminController = require('../controllers/adminController')




admin_Route.get('/',adminAuth.isLogout,adminController.loadLogin)

admin_Route.post('/',adminController.verifyLogin)
admin_Route.get('/home',adminAuth.isLogin,adminController.loadDashboard)

admin_Route.get('/logout',adminAuth.isLogin,adminController.logoutAdmin)

admin_Route.get('/forget',adminAuth.isLogout,adminController.forgetPassword)
admin_Route.post('/forget',adminController.forgetverify)
admin_Route.get('/display',adminAuth.isLogin,adminController.adminDashboard)

admin_Route.get('/create',adminAuth.isLogin,adminController.loadCreatePage)

admin_Route.post('/create',emailValidator, mobileNumValidator, adminController.createUser )

admin_Route.get('/edit',adminAuth.isLogin,adminController.editUser)
admin_Route.post('/edit',adminController.updateUser)
admin_Route.get('/delete',adminAuth.isLogin,adminController.deleteUser)


admin_Route.get('/*', function (req, res) {
    res.redirect('/admin')
})

module.exports = admin_Route