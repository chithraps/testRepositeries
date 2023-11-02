const emailValidator = require('email-validator')

function validateEmail(req, res, next) {
    const email = req.body.email;
    console.log("email vlidator")

    if (!emailValidator.validate(email)) {
        req.isValid = false;
        res.render('userRegistration', { isValid: req.isValid });
    } else {
        next();
    }
    
}

module.exports = validateEmail;