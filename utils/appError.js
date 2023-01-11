//global error handling
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    //an operational error is a predictable error
    this.isOperational = true;

    //err.stack shows where the error occurred with entire call stack
    // console.log(err.stack);

    //this is the AppError class itself
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
