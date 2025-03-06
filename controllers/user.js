const User = require("../models/user.js");

module.exports.signupForm = async (req, res) => {
    res.render("users/signup.ejs");
  }

  module.exports.postSignup = async (req, res, next) => {
      try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
          if(err) {
            return next(err);
          }
          req.flash("success", "Sign up successful!");
          res.redirect("/listings");
        })
  
      } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
      }
    }


module.exports.loginForm = async (req, res) => {
    res.render("users/login.ejs");
  }

  module.exports.postLogin = async (req, res) => {
    req.flash("success", "Login successful!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }

  module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
      if(err) {
        return next(err);
      }
    req.flash("success", "Logout successful");
    res.redirect("/listings");
  });
  }