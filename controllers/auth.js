const User = require('../models/user');
const bcrypt = require('bcryptjs'); // Used for encrypting passwords
const mailSender = require('../utils/mail');
const crypto = require('crypto'); // Used for creating unique secure values
const { validationResult } = require('express-validator')

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
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors.array())
        return res.status(422).render('auth/register', {
            path: '/register',
            pageTitle: 'Register',
            errorMessage: errors.array()[0].msg
        })
    }

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

// Reset Password Page
// On GET
exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0]
    }
    else message = null;
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: message
    })
}

// On POST
exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err){
            console.log(err)
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({email: req.body.email})
            .then(user => {
                if(!user){
                    req.flash('error', 'E-mail doesn\'t belong to any account!');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000; // one hour
                return user.save()
            }).then(result => {
                res.redirect('/reset');
            mailSender.sendMail({
                to: req.body.email,
                from: 'markosudar02@gmail.com',
                subject: 'Password Reset',
                html: `
                <p> You requested a password reset </p>
                <p> You can do this by clicking on <a href="http://localhost:3000/reset/${token}">this link</a> </p>
                `
            })
        })
            .catch(err => {
            console.log(err)
        });
    })
}

// New Password Page
// On GET
exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
        .then(user => {
            let message = req.flash('error');
            if(message.length > 0){
                message = message[0]
            }
            else message = null;
            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                errorMessage: message,
                userId: user._id.toString(),
                passwordToken: token
            })
        })
        .catch(err => {
            console.log(err)
        })
}

// On POST
exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    User.findOne({resetToken: passwordToken, resetTokenExpiration: {$gt: Date.now()}, _id: userId})
        .then(user =>{
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = null;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        })
        .then(result => {
            res.redirect('/login');
        })
        .catch(err => {
            console.log(err)
        })
}