const AppError = require("./../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}:${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(".")}`;
  return new AppError(message, 400);
};

const handleJWTError = (err) =>
  new AppError("Invalid token. Please login again!", 401);

const handleJWTExpiredError = (err) =>
  new AppError("Your token has expired! Please login again!", 401);

//error message during development
const sendErrorDev = (err, res) => {
  console.error(err);
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

//error message during production
const sendErrorProd = (err, res) => {
  //operational, trusted error: send message to client
  if (err.isOperational) {
    console.log(err);
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //programming or unknown error: do not send details to client
    console.error("ERROR", err);
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

//global error handling middleware
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  //different error message depending on environment
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    // let error = { ...err };

    //cast errors ie invalid database ID
    if (err.name == "CastError") err = handleCastErrorDB(err);

    //duplicate fields error ie name already exists
    if (err.code == 11000) err = handleDuplicateFieldsDB(err);

    //validation error ie schema errors
    if (err.name == "ValidationError") err = handleValidationErrorDB(err);

    //JWT error
    if (err.name === "JsonWebTokenError") err = handleJWTError(err);

    //JWT expired
    if (err.name === "TokenExpiredError") err = handleJWTExpiredError(err);

    //production error
    sendErrorProd(err, res);
  }
};
