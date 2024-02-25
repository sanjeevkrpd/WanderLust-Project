const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");


// render signup 
router.route("/signup")
.get(userController.RenderSignupForm)
.post(wrapAsync(userController.signupUser));

// login Route
router.route("/login")
.get(userController.RenderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect: "/login" , failureFlash :true}),userController.login);



router.get("/logout",userController.logout);

module.exports=router;