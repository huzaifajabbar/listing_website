const Listing = require("../models/listing.js");
const cloudinary = require('cloudinary').v2;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const Review = require("../models/review.js");

const geocodingClient = mbxGeocoding({ accessToken: "pk.eyJ1IjoibWFsaWtodXo5IiwiYSI6ImNtN3VlaHM0ZDAyd3IyanMybmk4eW00MTQifQ._vYZ3dlEvJ5smz6oEl8ixg" });


module.exports.index = async (req, res) => {
    let listings = await Listing.find({});
    res.render("listings/index.ejs", { listings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.listingDetails = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate:{path: "author"},}).populate("owner");
    if(!listing){
        req.flash("error", "The listing you requested for does not exist.");
       return res.redirect("/listings")
    }
    res.render("listings/show.ejs", {listing});
};

module.exports.editListingForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}

module.exports.postNewListing = async (req, res, next) => {

  let response = await geocodingClient.forwardGeocode({
    query: `${req.body.listing.location}, ${req.body.listing.country}`,
    limit: 1
   })
  .send()

    if (!req.file) {
        req.flash('error', 'Image is required!');
        return res.redirect('/listings/new');
    }

    const cloudinaryUpload = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: 'listings' },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary Upload Error:', error);
                    return reject(error);
                }
                resolve(result);
            }
        ).end(req.file.buffer);
    });

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.geometry = response.body.features[0].geometry;
    newListing.image = {
        url: cloudinaryUpload.secure_url,
        filename: cloudinaryUpload.public_id
    };

    await newListing.save();
    req.flash('success', 'New listing created!');
    res.redirect(`/listings/${newListing._id}`);
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const updatedListing = req.body.listing;
    const listing = await Listing.findById(id);
    if (req.file) {
        if (listing.image && listing.image.filename) {
            await cloudinary.uploader.destroy(listing.image.filename);
        }
        const cloudinaryUpload = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: 'listings' },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            ).end(req.file.buffer);
        });

        updatedListing.image = {
            url: cloudinaryUpload.secure_url,
            filename: cloudinaryUpload.public_id
        };
    }
    
    await Listing.findByIdAndUpdate(id, updatedListing, { new: true });
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
}

module.exports.postReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Review added!");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
}