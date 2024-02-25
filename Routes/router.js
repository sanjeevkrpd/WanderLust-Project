const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn , isOwner ,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })





//show route
router.get("/", wrapAsync(listingController.index));

//New Route
router.get("/new", isLoggedIn,wrapAsync(listingController.renderNewForm));

//create route
router.post("/add", isLoggedIn,upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing));


//edit route

router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

//show route , update route , delete route
router.route("/:id")
.get(wrapAsync(listingController.showListings))
.put(isLoggedIn,upload.single("listing[image]"),isOwner, wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));



module.exports = router;