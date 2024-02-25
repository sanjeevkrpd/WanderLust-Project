if(process.env.NODE_ENV!= "production"){

    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const ejsMate = require("ejs-mate");
const SearchRouter = require("./Routes/search.js");
const listingsRouter = require("./Routes/router.js");
const reviewRouter = require("./Routes/review.js");
const userRouter = require("./Routes/user.js")
const User = require("./models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash = require("connect-flash");
const { serialize } = require("v8");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, ("views")));


 const DB_URL = process.env.ATLASDB_URL;

app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
app.engine("ejs", ejsMate);
main()
    .then((res) => {
        console.log("Connection Successful");
    })
    .catch((err) => {
        console.log(err);
    })

async function main() {

    await mongoose.connect(DB_URL);
};

// session 

const store = MongoStore.create({
    mongoUrl : DB_URL,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter : 24*3600,
})

store.on("error",()=>{
    console.log("Error In Mongo Session Stroe",err);
});

const sessionOption = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
}


app.use(session(sessionOption));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

// routes
app.use(SearchRouter);
app.use("/listings",listingsRouter);
app.use("/listings/:id/review" , reviewRouter);
app.use("/",userRouter);


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "PAGE NOT FOUND ! :("));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "SOMETHING WENT WRONG :(" } = err;
    res.status(statusCode).render("error.ejs", { message });
    // res.status(statusCode =500).send(message = "SOMETHING WENT WRONG :(");
});


app.listen(8080, () => {
    console.log("app is listening to the port 8080");
});