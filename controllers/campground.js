const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");

module.exports.allcampHome = async (req, res, next) => {
  const camps = await Campground.find({});
  res.render("home", { camps });
};

module.exports.new = (req, res) => {
  res.render("new");
};

module.exports.allcampPost = async (req, res, next) => {
  // console.log(req.body);
  // if (!req.body.newcamp) {
  //   throw new AppError("validation error", 400);
  // }
  const { title, location, image, description, price } = req.body;
  const newcamp = new Campground({
    title: title,
    location: location,
    // image: image,
    description: description,
    price: price,
  });
  newcamp.images = req.files.map(f => ({
    url: f.path,
    filename: f.filename,
  }));
  newcamp.author = req.user;
  await newcamp.save();

  req.flash("message", "you are successfully create a new campground.");
  res.redirect("/allcamp");
};

module.exports.singleCamp = async (req, res, next) => {
  try {
    const { id } = req.params;
    const camps = await Campground.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    // error handling for async await
    // if (!camps) {
    //   return next(new AppError("not found anything..", 404));
    // }
    if (!camps) {
      req.flash("error", "can not find this campground.");
      return res.redirect("/allcamp");
    }
    res.render("show", { camps });
  } catch (err) {
    //or next(err)
    // default Error does not provite status code so we used custom error....
    next(new AppError("data not found..", 501));
  }
};

module.exports.editCamp = async (req, res, next) => {
  const { id } = req.params;
  const camps = await Campground.findById(id);
  if (!camps) {
    req.flash("error", "can not find..");
    return res.redirect("/allcamp");
  }
  res.render("edit", { camps });
};

module.exports.updateCamp = async (req, res, next) => {
  const { id } = req.params;
  console.log(req.body);
  const product = await Campground.findByIdAndUpdate({ _id: id }, req.body, {
    runValidators: true,
    new: true,
  });
  const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
  product.images.push(...imgs);
  product.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      cloudinary.uploader.destroy(filename);
    }
    await product.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("message", "you are successfully updated campground.");
  res.redirect(`/allcamp/${product._id}`);
};

module.exports.deleteCamp = async (req, res, next) => {
  const { id } = req.params;
  const deletedata = await Campground.findByIdAndDelete(id);
  if (!deletedata) {
    req.flash("error", "can not found data..");
    return res.redirect("/allcamp");
  }
  req.flash("message", "you are successfully deleted campground.");
  res.redirect("/allcamp");
};
