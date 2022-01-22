if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const ejsMate = require('ejs-mate');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ExpressError = require('./utils/expressErrors');
const catchAsync = require('./utils/catchAsync');
const Campground = require('./models/campground');
const Joi = require('joi');
const { campgroundSchema, reviewSchema } = require('./schemas');
const Review = require('./models/review');

const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

// const {MongoStore} = require('connect-mongo');
const MongoDBStore=require("connect-mongo")(session); 

const dbUrl=process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'


app.use(methodOverride('_method'));



const campgroundRoutes = require('./routes/campground');
const reviewRoutes = require('./routes/review');
const userRoutes = require('./routes/User');

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true

})
    .then(() => {
        console.log('MONGOOSE connection open!!!');
    })
    .catch(err => {
        console.log(err);
        console.log('MONGOOSE CONNECTION FAILED!!!');
    });

const secret=process.env.SECRET || 'thisisasecret!'

const store=new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter:24 * 60 * 60
})


const sessionConfig = {
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}



app.use(session(sessionConfig));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





    
const db = mongoose.connection;
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000!!!");
})


app.use((req, res, next) => {
    // console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})



// DEFINING MY OWN MIDDLEWARE TO HANDLE ERRORS
app.get('/fakeuser', async (req, res) => {
    const user = new User({ email: 'colttttt@gmail.com', username: 'coltttt' });
    const newUser = await User.register(user, 'chicken');
    res.send(newUser);
})



app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.get('/', (req, res) => {
    res.render('home');
})






app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found!!!', 404));
})





// ERROR HANDLER !!!
app.use((err, req, res, next) => {
    const { status = 500, } = err;
    if (!err.message) err.message = 'Oh NO!!! Something went Wrong!!!'
    res.status(status).render('error', { err });
    // res.send('OH boy!!! something went wrong!!!')
})











