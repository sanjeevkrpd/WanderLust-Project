const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReviewSchema, isLoggedIn , isReviewOwner } = require("../middleware.js")
const  reviewController = require("../controllers/review.js");


 //Post Review Route
 router.post("/",isLoggedIn,validateReviewSchema,wrapAsync(reviewController.createReview));

// deleting reviews route
router.delete("/:reviewid",isLoggedIn,isReviewOwner,wrapAsync(reviewController.deleteReview));


module.exports = router;