const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const userController = require('../controllers/user.js');

function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
}

router.get(
  "/signup",
  wrapAsync(userController.signupForm)
);

router.post(
  "/signup",
  wrapAsync(userController.postSignup)
);

router.get(
  "/login",
  wrapAsync(userController.loginForm)
);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(userController.postLogin)
);

router.get("/logout", userController.logout);

function saveRedirectUrl (req, res, next) {
  if(req.session.redirectUrl) {
      res.locals.redirectUrl = req.session.redirectUrl;
  }
  next(); 
}

module.exports = router;
