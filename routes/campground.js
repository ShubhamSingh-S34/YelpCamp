const express = require('express');
const router = express.Router()
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressErrors');
const Campground = require('../models/campground');
const { campgroundSchema, reviewSchema } = require('../schemas');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campground');
const { storage } = require('../cloudinary');
const multer = require('multer');
const upload = multer({ storage });



router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));


// router.get('/', catchAsync(campgrounds.index));

// ADDING A NEW CAMPGROUND--- GET REQUEST TO LAND ON THE FORM PAGE
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

// ADDING A NEW CAMPGROUND--- POST REQUEST TO SEND DATA FROM FORM PAGE AND TO MAKE CAMPGROUND
// router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

// PAGE FOR A PARTICULAR CAMPGROUND!!!


router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

// router.get('/:id', catchAsync(campgrounds.showCampground));

// EDITING A CAMPGROUND--- LANDING ON THE FORM PAGE TO EDIT DATA
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

// EDITING A CMPGROUND--- PUT REQUEST TO UPDATE THE DATA
// router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

// DELETING A PARTICULAR CAMPGROUND
// router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));


module.exports = router;