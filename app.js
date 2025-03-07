require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./init/expressErrors.js");
const listings = require("./init/routes.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./init/userRoutes.js");
const MongoStore = require('connect-mongo');

const app = express();

// Database setup
const dbUrl = process.env.ATLAS_DB_URL;
main().then(() => console.log("Database connected")).catch((err) => console.log(err));
async function main() {
    await mongoose.connect(dbUrl);
}

// App setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Session setup
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: { secret: process.env.SECRET },
    touchAfter: 24 * 3600,
});
store.on("error", (err) => console.log("Session Store Error", err));

app.use(session({
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}));

// Flash + Passport setup
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// Routes
app.get("/", (req, res) => res.render("listings/home.ejs"));
app.use("/listings", listings);
app.use("/", userRouter);

// Error handling
app.all("*", (req, res, next) => next(new ExpressError(404, "Page not found!")));
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong!" } = err;
    res.status(status).render("listings/error.ejs", { status, message });
});

// Export the app for Vercel
module.exports = app;
