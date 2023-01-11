const User = require("./../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

//rounte handler - get all users
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: { users },
  });
});

//rounte handler - get user
exports.getUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

//no handler for create user, use sign up instead

//rounte handler - update user ; for admin ; do not update password with this
exports.updateUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError("No document user found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: { data: user },
  });
});

//rounte handler - delete user
exports.deleteUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: {},
  });
});

//loop through object using object.keys and return permitted fields
const filteredObj = (obj, ...allowedFields) => {
  const newObj = {};
  //for each field check if it is an allowed field then create new field in new object with same name and value
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

/////////////////////// user can perform function

//router handler - update currently autheticated user
exports.updateMe = catchAsync(async (req, res, next) => {
  //create error if user POSTs password data
  //filter out fields that are not allowed to be updated
  //update user document

  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword",
        400
      )
    );

  //filter the body of info ; requires an additional function called filtered Obj
  const filteredBody = filteredObj(req.body, "name", "email");

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    //returns updated object
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

//route handler - delete user; active set to false
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: {},
  });
});

//route handler - get user data ; user can get their own data
//middleware
exports.getMe = (req, res, next) => {
  //id from currently logged in user instead of url parameter
  req.params.id = req.user.id;
  next();
};
