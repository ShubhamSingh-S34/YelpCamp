const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { route } = require('./campground');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/user');



router.route('/register')
    .get(users.renderregister)
    .post(catchAsync(users.register));

// router.get('/register', users.renderregister);
// router.post('/register', catchAsync(users.register))

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);


// router.get('/login', users.renderLogin);

// router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);



router.get('/logout', users.logout)
module.exports = router;