const { campgroundSchema, reviewSchema } = require('./schemas');
const ExpressError = require('./utils/expressErrors');
const Campground = require('./models/campground');
const Review = require('./models/review');

//MIDDLEWARE TO CHECK WHEATHER THE USER IS LOGGED IN OR NOT 
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be singed in !!!');
        return res.redirect('/login');
    }
    next();
}




//DEFINING A MIDDLEWARE TO VALIDATE CAMPGROUND 
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

//DEFINGING WHETHER THE USER IS AUTHOR OF CAMPGROUND OR NOT
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    console.log('PRINTING THIS CAMPGROUND', campground);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!!!');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}



//DEFINIGN A MIDDLEWARE TO VALIDATE REVIEW
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}



module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    console.log("PRINTING THIS REVIEW OBJECT", review);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!!!');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}
