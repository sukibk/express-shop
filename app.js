const express = require('express');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const csurf = require('csurf');
const flash = require('connect-flash');
require('dotenv').config();

const errorController = require('./controllers/error');

const User = require('./models/user');

const store = new MongoDbStore({
    uri: process.env.MONGODB_URI,
    collection: 'sessions'
})

const csurfProtection = csurf();

app.set('view engine', 'ejs');
app.set('views', 'views')

const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
}))

app.use(csurfProtection)
app.use(flash())

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

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use(shopRoutes)
app.use(authRoutes)

app.use(errorController.get404);

mongoose
    .connect(process.env.MONGODB_URI)
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });