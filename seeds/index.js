const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose
  .connect("mongodb://127.0.0.1:27017/yelpcamp")
  .then(e => console.log("running db"))
  .catch(err => console.log(err));

const sample = array => array[Math.floor(Math.random() * array.length)];

const seed = async () => {
  await Campground.deleteMany({});
  const random1000 = Math.floor(Math.random() * 1000);
  for (let i = 0; i < 10; i++) {
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url: "https://res.cloudinary.com/dpaumvy6e/image/upload/v1693122893/YelpCamp/j6yuop1undbffqaeryua.jpg",
          filename: "YelpCamp/j6yuop1undbffqaeryua",
        },
        {
          url: "https://res.cloudinary.com/dpaumvy6e/image/upload/v1693122894/YelpCamp/mlicy7zmcb0vlci8turn.jpg",
          filename: "YelpCamp/mlicy7zmcb0vlci8turn",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure, vero nostrum vitae aperiam accusamus culpa neque debitis maxime explicabo fugit quasi sed illo quaerat facilis numquam. Inventore, veritatis? Beatae deleniti itaque amet numquam vel!",
      price: random1000,
      author: "64e1f186db0dacfd522f2769",
    });
    await camp.save();
  }
};

seed();
