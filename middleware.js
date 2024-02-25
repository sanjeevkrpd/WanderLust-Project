const Listing = require("./models/listing.js");
const {ExpressError} = require("./utils/ExpressError.js");
const { listingSchema,reviewSchema} = require("./Joi.js");
const Review = require("./models/review.js"); 
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {

        req.session.redirect = req.originalUrl;
        req.flash("error", "You must be logged in to create listings!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{

    if (req.session.redirectUrl) {
        res.locals.RedirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)){
        req.flash("error" ,"You are not the owner to preform any task !");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateReviewSchema = (req, res, next) => {

    let { error } = reviewSchema.validate(req.body);

    if (error) {

        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}
module.exports.validateListing = (req, res, next) => {

    let { error } = listingSchema.validate(req.body);

    if (error) {

        let error = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, error);
    } else {
        next();
    }
}
module.exports.isReviewOwner = async(req,res,next)=>{
    
    let { id ,reviewid } = req.params;
    let review = await Review.findById(reviewid);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error" ,"You are not the author of this review !");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
