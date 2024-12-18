const Campground = require("./models/campground");
const Review = require("./models/review");
module.exports.isLognedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // we are stored the original path after login here..
    req.session.returnTo = req.originalUrl;
    req.flash("error", "you must be logned in");
    return res.redirect("/login");
  }
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const camps = await Campground.findById(id);
  if (!camps.author.equals(req.user._id)) {
    req.flash("error", "you are not allowed.");
    return res.redirect(`/allcamp/${id}`);
  }
  next();
};
module.exports.reviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "you are not allowed.");
    return res.redirect(`/allcamp/${id}`);
  }
  next();
};
