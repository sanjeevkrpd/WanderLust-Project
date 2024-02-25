const User = require("../models/user");

module.exports.RenderSignupForm = (req,res)=>{

    res.render("../views/listings/signup.ejs");
};
module.exports.RenderLoginForm = (req,res)=>{

    res.render("../views/listings/login.ejs");
};

module.exports.signupUser = async(req,res)=>{

    try {
     let {username , email ,password} = req.body;
     let newUser = new User({email,username});
     let registeredUser = await User.register(newUser,password);
 
     req.login(registeredUser,(err)=>{
         if(err){
             next(err);
         }
         req.flash("success","Welcome to the WanderLust");
         res.redirect("/listings");
     });
 
 } catch (error) {
     req.flash("error",error.message);
     res.redirect("/signup");
 }
 };


 module.exports.login =async(req,res)=>{

    req.flash("success","welcome back to WonderLust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listings");
    });
}