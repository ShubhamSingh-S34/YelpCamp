const express = require('express');
const router = express.Router({ mergeParams: true })
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressErrors');
const Campground = require('../models/campground');
const Review = require('../models/review');
const reviews = require('../controllers/reviews');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const { campgroundSchema, reviewSchema } = require('../schemas');



// POST REQUEST FOR MAKING A REVIEW
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReviews));


// DELETING A REVIEW AND ITS REFERENCE FROM THE RESPECTIVE CAMPGROUND
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))





module.exports = router;