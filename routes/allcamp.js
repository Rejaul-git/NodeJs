const express = require("express");
const Joi = require("joi");
const Campground = require("../models/campground");
const AppError = require("../error");
const { isLognedin, isAuthor } = require("../middleware");
const campgrounds = require("../controllers/campground");
const { storage } = require("../cloudinary");
const multer = require("multer");
const router = express.Router();

function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(error => next(error));
  };
}
const upload = multer({ storage });
// joi validation middleware
const joiMiddleware = (req, res, next) => {
  const joiSchema = Joi.object({
    title: Joi.string().required(),
    location: Joi.string().required(),
    // image: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().min(10).required(),
    deleteImages: Joi.array(),
  });

  const { error } = joiSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const msg = error.details.map(e => e.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};
router.get("/", wrapAsync(campgrounds.allcampHome));

router.get("/new", isLognedin, campgrounds.new);

router.post(
  "/",
  isLognedin,
  upload.array("image"),
  joiMiddleware,
  wrapAsync(campgrounds.allcampPost)
);

router.get("/:id", isLognedin, campgrounds.singleCamp);

router.get("/:id/edit", isLognedin, isAuthor, wrapAsync(campgrounds.editCamp));

router.put(
  "/:id",
  isLognedin,
  isAuthor,
  upload.array("image"),
  joiMiddleware,
  wrapAsync(campgrounds.updateCamp)
);

//*********** best way to handle error */
router.delete("/:id", isLognedin, isAuthor, wrapAsync(campgrounds.deleteCamp));
module.exports = router;
