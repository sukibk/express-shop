// Variables
const express = require('express');
const path = require('path');

const app = express();

const User = require('./models/user')

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const csurf = require('csurf');
const flash = require('connect-flash');

// Enables access to process.env
require('dotenv').config();

const errorController = require('./controllers/error');


// Registering a store
const store = new MongoDbStore({
    uri: process.env.MONGODB_URI,
    collection: 'sessions'
})

// Used for csrf protection - expected with each form
const csrfProtection = csurf();

// Setting up the ejs and views folders
app.set('view engine', 'ejs');
app.set('views', 'views')

const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin')

// Parses req.body
app.use(bodyParser.urlencoded({ extended: false }));

// Enables access to a public folder
app.use(express.static(path.join(__dirname, 'public')));

// Creates a session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
}))

// Adds csrf expectations to submits
app.use(csrfProtection)

// Adds flash memory for request (helps with error handling)
app.use(flash())

// Creates req.user on login
app.use((req, res, next) => {
    if(!req.session.user){
        return next();
    }
    else{
        User.findById(req.session.user._id)
            .then(user => {
                req.user = user;
                next();
            })
            .catch(err => {
                console.log(err)
            })
    }
})

// Gives views access to those attributes
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

// Routing
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

// Server creation
mongoose
    .connect(process.env.MONGODB_URI)
    .then(()=> {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });