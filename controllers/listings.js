const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAPBOX_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });

};
module.exports.renderNewForm = (req, res) => {

    res.render("listings/new.ejs");
}

module.exports.showListings = async (req, res) => {

    let { id } = req.params;
    const data = await Listing.findById(id).populate({
      path: 'reviews',
      populate: {
        path: 'author',
        model: 'User'
      }
    }).populate('owner');


    if(!data){
        req.flash("error","Listings You'r Requested For Does't Exits !");
        res.redirect("/listings");
    }
    console.log(data);
    res.render("listings/show.ejs", { data });
};

module.exports.createListing = async (req, res) => {

  let response =  await geocodingClient.forwardGeocode({
        query:  req.body.listing.location,
        limit: 1,
      })
        .send()

    let url = req.file.path;
    let filename = req.file.filename;
    let listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    listing.image = {url,filename};

    listing.geometry = response.body.features[0].geometry;

    await listing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");

};

module.exports.renderEditForm = async (req, res ,next) => {
    let { id } = req.params;
    const data = await Listing.findById(id);
    
    if(!data){
        req.flash("error","Listings You'r Requested For Does't Exits !");
        res.redirect("/listings");
    }
    let originalImgaeUrl = data.image.url;
    originalImgaeUrl = originalImgaeUrl.replace("upload","/upload/h_300,w_250");


    res.render("listings/edit.ejs", { data , originalImgaeUrl });
};
module.exports.updateListing = async (req, res) => {
    let error; // Declare the error variable outside the try-catch block

    try {
        const { id } = req.params;
        const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

        const response = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
        }).send();

        listing.geometry = response.body.features[0].geometry;

        if (req.file) {
            const { path, filename } = req.file;
            listing.image = { url: path, filename };
        }

        const savedListing = await listing.save();
        console.log(savedListing);

        req.flash("success", "Listing Updated.");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        error = err; // Assign the error to the variable
        console.error(error);
        req.flash("error", "An error occurred while updating the listing.");
        res.redirect(`/listings/${id}/edit`);
    }
};


// module.exports.updateListing = async (req, res) => {

//     let { id } = req.params;
//     let listing =  await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    
//     if(typeof req.file !== "undefined"){
//         let url = req.file.path;
//         let filename = req.file.filename;
//         listing.image = {url,filename};
//         await listing.save(); 
//     }
   
//     req.flash("success"," Listing  Updated.")
//     res.redirect(`/listings/${id}`);
// };

module.exports.deleteListing = async (req, res) => {

    let { id } = req.params;

    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted Successfully !")
    res.redirect("/listings");
};
