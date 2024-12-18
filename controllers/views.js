const Review = require("../models/review");
const Campground = require("../models/campground");

module.exports.viewPost = async (req, res, next) => {
  const camp = await Campground.findById(req.params.id);
  const { range, textarea } = req.body;
  const review = new Review({ body: textarea, rating: range });
  review.author = req.user._id;
  camp.reviews.push(review);
  await review.save();
  await camp.save();
  req.flash("message", "created a new review.");
  res.redirect(`/allcamp/${camp._id}`);
};
module.exports.viewDelete = async (req, res) => {
  const { id, reviewId } = req.params;

  const idd = await Campground.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });

  await Review.findByIdAndDelete(reviewId);
  req.flash("message", "comment deleted.");
  res.redirect(`/allcamp/${id}`);
};
