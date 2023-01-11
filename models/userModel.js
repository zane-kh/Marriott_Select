const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const reviewSchema = new mongoose.Schema({
  rating: { type: Number },
  review: { type: String },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validator: [validator.isEmail, "Please provide a valid email"],
  },
  // photo: {
  //   type: String,
  // },
  // role: {
  //   type: String,
  //   enum: ["user", "hotel-owner", "admin"],
  //   default: "user",
  // },
  // password: {
  //   type: String,
  //   required: [true, "Please provide a password"],
  //   minlength: 8,
  //   //prevent password from displaying in postman
  //   select: false,
  // },
  // passwordConfirm: {
  //   type: String,
  //   required: [true, "Please confirm your password"],
  //   //validate if password equals confirmed password using a function
  //   validate: {
  //     validator: function (el) {
  //       //returns true if passwords match
  //       return el === this.password;
  //     },
  //     //error message if passwords do not message
  //     message: "Passwords are not the same!",
  //   },
  googleId: {
    type: String,
  },
  //password reset
  // passwordChangedAt: Date,
  // passwordResetToken: String,
  // passwordResetExpires: Date,
  // active: {
  //   type: Boolean,
  //   default: true,
  //   select: false,
  // },
  reviews: {
    type: [mongoose.Types.ObjectId],
    ref: "Review",
  },
});

/////////////////////////////////middleware

//encrpyt users password
//password presave middleware, btwn getting data and saving to database
// userSchema.pre("save", async function (next) {
//   //only encrpyt a modified password, exit function if password is not modified
//   if (!this.isModified("password")) return next();

//   //salt(add string) and hash(encrpyt) password
//   //standard cost(cpu intensity) of 12
//   this.password = await bcrypt.hash(this.password, 12);

//   //delete confirmed password because only real password is encrypted
//   //password confirmed is only required for validation, does not need to be persisted to database
//   this.passwordConfirm = undefined;

//   next();
// });

//instance method aka function called correctPassword
//defined on a user schema
//cannot use this.password because password is set to select: false
// userSchema.methods.correctPassword = async function (
//   candidatePassword,
//   userPassword
// ) {
//   return await bcrypt.compare(candidatePassword, userPassword);
// };

//instance method aka function called changedPasswordAfter
//defined on a user schema
// userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
//   if (this.passwordChangedAt) {
//     console.log(this.passwordChangedAt, JWTTimestamp);
//     const changedTimestamp = parseInt(
//       this.passwordChangedAt.getTime() / 1000,
//       10
//     );

//     return JWTTimestamp < changedTimestamp;
//   }
//   //false means NOT changed
//   return false;
// };

//instance method to generate random token for password reset
// userSchema.methods.createPasswordResetToken = function () {
//   const resetToken = crypto.randomBytes(32).toString("hex");
//   this.passwordResetToken = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");

//   //password reset expiry
//   this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

//   //return plain token because it will be sent via email
//   return resetToken;
// };

//reset password middleware runs before save
// userSchema.pre("save", function (next) {
//   //exit middleware function if password has been modified or document is new
//   if (!this.isModified("password" || this.isNew)) return next();

//   //issuing token is faster than saving to database
//   //fix this by subtracting 1 second from passwordChangedAt
//   this.passwordChangedAt = Date.now() - 1000;
//   next();
// });

//prequery middleware
//runs before find query to hide inactive users
//use a regular expression to look for all words starting with find
// userSchema.pre(/^find/, function (next) {
//   //this points to the current query
//   //ne is not equal
//   this.find({ active: { $ne: false } });
//   next();
// });

const User = mongoose.model("User", userSchema);

module.exports = User;
