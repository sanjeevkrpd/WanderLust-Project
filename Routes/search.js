const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
router.get("/search", wrapAsync(async (req, res) => {
    try {
        const { place } = req.query;
        const lowerCasePlace = place.toLowerCase();
        const results = await Listing.find({
            $or: [
                { location: { $regex: new RegExp(lowerCasePlace, 'i') } }, // Case-insensitive search
                { country: { $regex: new RegExp(lowerCasePlace, 'i') } },  // Case-insensitive search
            ]
        });

        
        if (results.length > 0) {
            req.flash("success", "Your searched result.");
            res.render("listings/search.ejs", { results });
            
        } else {
            req.flash("error", "Data not found. Please modify the search.");
            res.redirect("listings");
        }
    } catch (error) {
        console.error(error);
        req.flash("error", "An error occurred while processing your request.");
        res.redirect("back"); // Redirect back to the previous page
    }
}));

router.get('/category', async (req, res) => {
    try {
        let category = req.query.category;

        category = category.replace(/^"(.*)"$/, '$1');

        const results = await Listing.find({ category: new RegExp(category, 'i') });

        if (results.length > 0) {
            req.flash("success", "Your searched result.");
            res.render("listings/search.ejs", { results });
            
        } else {
            req.flash("error", "Data not found. Please modify the search.");
            res.redirect("listings");
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});



module.exports = router;