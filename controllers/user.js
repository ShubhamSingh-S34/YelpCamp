const User = require('../models/user');
const passport = require('passport');


module.exports.renderregister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res) => {
    try {

        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err)
            req.flash('success', "Welcome to yelp camp");
            res.redirect('/campgrounds');
        })
        // console.log(registeredUser);

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}



module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}


module.exports.login = (req, res) => {
    req.flash('success', 'Welcome Back!!! Its good to have you back!!!');
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(redirectUrl);
}


module.exports.logout = (req, res) => {
    req.logOut();
    req.flash('success', 'Goodbye!!!');
    res.redirect('/campgrounds');
}