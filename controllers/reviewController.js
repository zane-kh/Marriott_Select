const Review = require("../models/reviewModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");

//handler -- get all reviews
exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.id) filter = { hotel: req.params.id };

  const reviews = await Review.find();

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

//handler -- get specific review
exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      review,
    },
  });
});

//handler -- create new review
exports.createReview = catchAsync(async (req, res, next) => {
  //allow nested routes
  if (!req.body.hotel) req.body.hotel = req.params.hotelId;

  //req.user comes from protect middleware
  // if (!req.body.user) req.body.user = req.user.id;

  //res.locals.user.id comes from logged in middleware
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);

  console.log("req.user._id=", req.user._id);

  User.findById(req.user._id, function (err, user) {
    console.log("user=", user);
    console.log("new review=", newReview);
    user.reviews.push(newReview);
    user.save(function (err) {
      console.log(err);
    });

    res.redirect("/");
    // console.log("req.user", req.user);
  });
  // res
  // .status(201)
  // .json({
  //   status: "success",
  //   data: {
  //     review: newReview,
  //   },
  // })
  // .redirect("/");
});

//handler -- update specific review
exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  User.findByIdAndUpdate(req.user.id, {
    $set: { review: { _id: req.body } },
  }).then((err) => res.redirect("/"));

  if (!review) {
    return next(new AppError("No review found with that ID", 404));
  }

  // res.status(200).json({
  //   status: "success",
  //   data: { data: review },
  // });
});

//handler -- delete specific review
exports.deleteReview = catchAsync(async (req, res, next) => {
  Review.findByIdAndDelete(req.params.id, function (err) {
    if (err) {
      res.redirect("/");
    } else {
      res.redirect("/");
    }
  });

  console.log("delete function =", req.params.id);
  console.log("user id=", req.user.id);

  User.findByIdAndUpdate(req.user.id, {
    $pull: { reviews: { _id: req.params.id } },
  });

  // User.findByIdAndUpdate(req.params.id, (err, user) => {
  //   const idx = user.reviews.indexOf(req.params.id);
  //   console.log("idex=", idx);
  //   user.reviews.splice(idx, 1);
  // });
});

// exports.
// });

// User.findByIdAndUpdate(req.user._id, (err, user) => {
//   const idx = user.reviews.indexOf((review) => review._id == req.user.id);
//   user.reviews.splice(idx, 1);
// });
