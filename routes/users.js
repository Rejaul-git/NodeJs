const express = require("express");
const User = require("../models/user");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");
const userController = require("../controllers/user");
const route = express.Router();

function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(e => next(e));
  };
}

route.get("/register", userController.registerUser);

route.post("/register", wrapAsync(userController.registerPost));

route.get("/login", userController.loginUser);
route.post(
  "/login",
  //storeReturnTo is a middleware that redirect to our current router after login..
  storeReturnTo,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  userController.loginPost
);

route.get("/logout", userController.logoutUser);
module.exports = route;
