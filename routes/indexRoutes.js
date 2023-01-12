var router = require("express").Router();
const passport = require("passport");
const viewController = require("../controllers/viewController");
const hotelController = require("../controllers/hotelsController");
const reviewController = require("../controllers/reviewController");

// The root route renders our only view
router.get("/", viewController.getLandingPage);

router.get("/login", viewController.getLoginForm);
router.get("/signup", viewController.getSignupForm);

router.get("/hotel/:id", viewController.getHotelPage);

router.post("/reviews", reviewController.createReview);

router.get("/accountsPage", viewController.getAccountsPage);

router.delete(
  "/reviews/:id",
  reviewController.deleteReview
  // reviewController.deleteReviewFromUser
);

router.post("/reviews/:id", reviewController.updateReview);

// {
// Where do you want to go for the root route
// in the student demo this was res.redirect('/students'), what do you want?
// This could be a landing page, or just redirect to your main resource page which you'll have an a tag that makes
// a request to `/auth/google` route below
// res.send("this is the landing page");
// });

// Google OAuth login route
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback route
router.get(
  "/oauth2callback",
  passport.authenticate("google", {
    successRedirect: "/", // where do you want the client to go after you login
    failureRedirect: "/login", // where do you want the client to go if login fails
  })
);

// OAuth logout route
router.get("/logout", function (req, res) {
  req.logout();
  req.session.destroy();
  res.redirect("/", viewController.getLandingPage);
});

module.exports = router;
