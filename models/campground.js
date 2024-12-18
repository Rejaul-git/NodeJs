const mongoose = require("mongoose");
const Review = require("./review");
const { string } = require("joi");
const Schema = mongoose.Schema;
const CamegroundSchema = new Schema({
  title: String,
  images: [
    {
      url: String,
      filename: String,
    },
  ],
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

CamegroundSchema.post("findOneAndDelete", async function (camp) {
  if (camp) {
    await Review.deleteMany({
      _id: {
        $in: camp.reviews,
      },
    });
  }
});
module.exports = mongoose.model("Campground", CamegroundSchema);
