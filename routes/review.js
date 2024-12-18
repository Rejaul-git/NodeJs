const express = require("express");
const Joi = require("joi");
const Campground = require("../models/campground");
const { isLognedin, reviewAuthor } = require("../middleware");
const AppError = require("../error");
const Review = require("../models/review");
const views = require("../controllers/views");
const router = express.Router({ mergeParams: true });

//*****(************************)error handling function alternative way of try nad catch
function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(e => next(e));
  };
}

const joivalidate = (req, res, next) => {
  const joiSchema = Joi.object({
    range: Joi.number().required(),
    textarea: Joi.string().required(),
  });

  const { error } = joiSchema.validate({ ...req.body }, { abortEarly: false });
  if (error) {
    const msg = error.details.map(e => e.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};

router.post("/", joivalidate, isLognedin, wrapAsync(views.viewPost));

router.delete(
  "/:reviewId",
  isLognedin,
  reviewAuthor,
  wrapAsync(views.viewDelete)
);

module.exports = router;
