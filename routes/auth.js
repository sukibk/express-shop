const express = require('express');
const router = express.Router();
const { check, body} = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

// Get routes
router.get('/login', authController.getLogin);
router.get('/register', authController.getRegister);
router.get('/reset', authController.getReset);
router.get('/reset/:token', authController.getNewPassword);

// Post routes
router.post('/login', authController.postLogin);
router.post('/register',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email')
            .custom((value, {req}) => {
                // if (value === 'test@test.com') {
                //     throw new Error('This email is forbidden');
                // }
                // return true;
                return User.findOne({email: value})
                    .then(user => {
                        if(user){
                            return Promise.reject('Email already registered');
                        }
                    })
            }),
        body('password',
            'Please enter a password with only numbers and text length between 5 and 16')
            .isLength({
            min: 5,
            max: 16
        }).isAlphanumeric(),
        body('repeatedPassword').custom((value, {req}) => {
            if(value !== req.body.password){
                throw new Error('Passwords have to match!')
            }
            return true;
        })
    ]
    , authController.postRegister);
router.post('/logout', authController.postLogout);
router.post('/reset', authController.postReset);
router.post('/new-password', authController.postNewPassword);

module.exports = router;