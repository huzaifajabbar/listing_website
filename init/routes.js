const express = require("express");
const Listing = require("../models/listing.js");
const ExpressError = require("../init/expressErrors.js");
const { ListingSchema, reviewSchema } = require("../views/listings/schemaValidation.js");
const Review = require("../models/review.js");
const router = express.Router({mergeParams: true});
const listingController = require('../controllers/listing.js');
const multer  = require('multer');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    };
}

router.get("/", wrapAsync(listingController.index));

router.get("/new", isLoggedIn, listingController.renderNewForm );

router.get("/:id", wrapAsync(listingController.listingDetails));

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListingForm));

router.post("/", isLoggedIn, upload.single('listing[image]'), wrapAsync(listingController.postNewListing));

router.put("/:id", isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing));

router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

router.post("/:id/reviews", isLoggedIn, wrapAsync(listingController.postReview));

router.delete("/:id/reviews/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(listingController.deleteReview));

function isLoggedIn(req, res, next) {
     if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must login first!");
        return res.redirect("/login");
     }
     next();
} 

async function isOwner(req, res, next) {
    let{id} = req.params;
    let listing = await Listing.findById(id)
    if(!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You do not have permission to perform this action");
       return res.redirect(`/listings/${id}`);
    }
    next();
}

async function validateListing(req, res, next) {
    let result = ListingSchema.validate(req.body);
    if (result.error) {
        throw new ExpressError(400, result.error);
    }
    next();
}

async function isReviewAuthor(req, res, next) {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You do not have permission to perform this action");
       return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports = router;
