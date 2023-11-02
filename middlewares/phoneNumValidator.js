function mobileNumValidator(req, res, next) {
    const mobileNum = req.body.mobile;
    const phoneNumberRegex = /^\d{10}$/;
   console.log("In mobile validator")
    if (!phoneNumberRegex.test(mobileNum)) {
        req.isValid = false;
        res.render('userRegistration', { isValid: req.isValid });

    } else {
        next();
    }

}

module.exports = mobileNumValidator;