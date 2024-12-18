const User = require("../models/user");
module.exports.registerUser = (req, res) => {
  res.render("../views/users/register.ejs");
};

module.exports.registerPost = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    //User.register() function save our data in database and hash our password
    const registerUser = await User.register(user, password);
    //req.login () function is used to login inside the register automaticaly.
    req.login(registerUser, err => {
      if (err) return next(err);
      req.flash("message", "welcome to campground");
      res.redirect("/allcamp");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/register");
  }
};

module.exports.loginUser = (req, res) => {
  res.render("../views/users/login.ejs");
};

module.exports.loginPost = (req, res) => {
  req.flash("message", "welcom back..");
  const redirectUrl = res.locals.returnTo || "/allcamp";
  res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("message", "Goodbye!");
    res.redirect("/allcamp");
  });
};
