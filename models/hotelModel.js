const mongoose = require("mongoose");
const User = require("./userModel");

//create schema
const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A hotel must have a name"],
      unique: true,
    },
    duration: { type: Number, required: [true, "A hotel must have a stay"] },
    ratingsAverage: {
      type: Number,
      default: 3,
      min: [1, "Rating must be above 1.0"],
      max: [7, "Rating must be below 7.0"],
    },
    ratingQuantity: { type: Number, default: 0 },
    price: { type: Number, required: [true, "A hotel must have a price"] },
    priceDiscount: { type: Number, default: 0 },
    summary: {
      type: String,
      trim: true,
      required: [true, "A hotel must have a description"],
    },
    description: { type: String, trim: true },
    imageCover: {
      type: String,
      required: [true, "A hotel must have a cover image"],
    },
    images: [String],
    checkIn: [Date],
    location: {
      // GeoJSON
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    Owners: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  },
  {
    //passing options, getting the virual properties to the document/object
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//virtual populate to keep array of IDs without persisting it to the database
hotelSchema.virtual("reviews", {
  ref: "Review",
  //foreign field is name of the field in the other model to connect 2 models
  foreignField: "hotel",
  //local field is where ID is actually stored in current hotel model
  localField: "_id",
});

//create model
const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;
