const User = require('../models/user');
const bcrypt = require('bcryptjs'); // Used for encrypting passwords
const mailSender = require('../utils/mail');

// Login Page
// On GET
exports.getLogin = (req, res, next) => {
    let message = req.flash('error'); // Used for invalid user alert
    if(message.length > 0){
        message = message[0]; // only if there's an error message in flash 'error' array
    }
    else message = null;
    console.log(message)
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message
    })
}

// On POST
exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email})
        .then(user => {
            if(!user){
                req.flash('error', 'Invalid E-mail')
                res.redirect('/login');
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if(doMatch){
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err)
                            res.redirect('/');
                        })
                    }
                    else{
                        req.flash('error', 'Invalid Password')
                        res.redirect('/login')
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        })
        .catch(err => {
            console.log(err)
        })
}

//Register Page
// On GET
exports.getRegister = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0];
    }
    else message = null;
    res.render('auth/register', {
        path: '/register',
        pageTitle: 'Register',
        errorMessage: message
    })
}

// On POST
exports.postRegister = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const repeatedPassword = req.body.repeatedPassword;

    if(repeatedPassword !== password){
        req.flash('error', 'Passwords do not match')
        return res.redirect('/register')
    }

    User.findOne({email: email})
        .then(user => {
            if(user){
                req.flash('error', 'Email already registered')
                res.redirect('/register')
            }
            return bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const newUser = new User({
                        email: email,
                        password: hashedPassword
                    })
                    return newUser.save();
                })
        })
        .then(() => {
            res.redirect('/login');
            return mailSender.sendMail({
                to: email,
                from: 'markosudar02@gmail.com',
                subject: 'Shop Registration',
                html: '<h1>Welcome to our Online Store!</h1>'
            })
        })
        .catch(err => {
            console.log(err)
        })
}

// Logout on POST
exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    })
}

