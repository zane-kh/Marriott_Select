const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      require: [true, "Review cannot be empty gym!"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 7,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    hotel: {
      type: mongoose.Schema.ObjectId,
      ref: "Hotel",
      // required: [true, "Review must belong to a specific hotel."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user."],
    },
  },
  {
    //passing options, getting the virual properties to the document/object
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//pre query middleware to populate get all reviews on postman
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    //hotel property of review scehma
    path: "hotel",
    //only display hotel name
    select: "name",
  }).populate({
    path: "user",
    select: "name",
  });
  next();
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
