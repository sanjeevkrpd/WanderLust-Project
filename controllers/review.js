const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {

    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

   await newReview.save();
   await listing.save();
   req.flash("success"," New Review Created.")
   res.redirect(`/listings/${req.params.id}`);
};


module.exports.deleteReview = async(req,res)=>{

    let {id , reviewid} = req.params;

    await Listing.findByIdAndUpdate(id , {$pull :{reviews : reviewid}});
    req.flash("success"," Review Updated.")
    await Review.findByIdAndDelete(reviewid);
    req.flash("success"," Review Deleted !")
    res.redirect(`/listings/${id}`);
};