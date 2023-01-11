const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
// session middleware
const session = require("express-session");
const passport = require("passport");

const methodOverride = require("method-override");
// load the env consts
require("dotenv").config();

// create the Express app
const app = express();

//routers
const indexRouter = require("./routes/indexRoutes");
// const hotelsRouter = require("./routes/hotelsRoutes");

const bodyParser = require("body-parser");

// connect to the MongoDB with mongoose
require("./config/database");
// configure Passport
require("./config/passport");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// mount session middleware (for google ouath)
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Add this middleware BELOW passport middleware
app.use(function (req, res, next) {
  res.locals.user = req.user; // assinging a property to res.locals, makes that said property (user) availiable in every
  // single ejs view
  next();
});

// mount all routes with appropriate base paths
app.use("/", indexRouter);
// app.use("/hotels", hotelsRouter);

// invalid request, send 404 page
app.use(function (req, res) {
  res.status(404).send("Cant find that!");
});

module.exports = app;
