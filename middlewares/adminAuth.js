const isLogin = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            next();
        } else {
            res.redirect('/admin')
        }
    } catch (error) {
        console.log(error.message)
    }
}

const isLogout = async (req, res, next)=>{
    try {
        if (req.session.user_id) {
            console.log("in isLogout if")
            res.redirect('/admin/home')

        } else {
            console.log("in isLogout else")
            next();
        }
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    isLogin,
    isLogout
}