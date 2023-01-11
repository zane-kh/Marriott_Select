const Hotel = require("../models/hotelModel");
const catchAsync = require("../utils/catchAsync");
const Review = require("../models/reviewModel");
const User = require("../models/userModel");

exports.getLandingPage = catchAsync(async (req, res, next) => {
  //get hotel data from collection
  //built template
  //render template using hotel data

  user = res.locals.user;

  const hotels = await Hotel.find();

  res
    .status(200)
    .render("landingpage.pug", { title: "Destination Hotels", hotels });
  // console.log(user);
});

// exports.getHotelPage = (req, res) => {
//   res.status(200).render("hotel", { title: "Hotel details page" });
// };

exports.getHotelPage = catchAsync(async (req, res, next) => {
  //get data for request hotel including reviews and owners
  //built template
  //render template using hotel data
  // console.log(req.user);
  const hotel = await Hotel.findById(req.params.id).populate({
    path: "reviews",
    fields: "review rating user",
  });

  res
    .status(200)
    // .set(
    //   "Content-Security-Policy",
    //   "default-src 'self' https://*.mapbox.com https://*.stripe.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com https://js.stripe.com/v3/ 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    // )
    .render("hotel", { title: `${hotel.name}`, hotel });
  // console.log(user);
});

exports.getLoginForm = (req, res) => {
  res.status(200).render("login", {
    title: "log into your account",
  });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render("signup", {
    title: "signup for an account",
  });
};

exports.getAccountsPage = catchAsync(async (req, res) => {
  // console.log(res.locals.user.id);
  const user = await User.findById(res.locals.user.id).populate("reviews");
  //populates an id into document 

  console.log(user);

  // console.log(review);

  res.status(200).render("account", { title: "Accounts Page", user });
  // console.log(user.reviews);
});
