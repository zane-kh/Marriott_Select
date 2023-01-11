const Hotel = require("./../models/hotelModel");
const catchAsync = require("./../utils/catchAsync"); //catchAsync wrapper
const AppError = require("./../utils/appError"); //AppError function

//route handler - get all Hotels
exports.getAllHotels = catchAsync(async (req, res, next) => {
  // const user = res.locals.user;
  const hotels = await Hotel.find();

  res.status(200).json({
    status: "success",
    results: hotels.length,
    data: { hotels, user },
  });
});

//route handler - get specific Hotels
exports.getHotel = catchAsync(async (req, res, next) => {
  //.populate populates the virtual review
  const hotel = await Hotel.findById(req.params.id).populate("reviews");
  console.log("hotel info:", hotel);

  if (!hotel) {
    return next(new AppError("No hotel found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: { hotel },
  });
});

//route handler - create Hotels
exports.createHotel = catchAsync(async (req, res, next) => {
  const newHotel = await Hotel.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      hotel: newHotel,
    },
  });
});

//route handler - update Hotels
exports.updateHotel = catchAsync(async (req, res, next) => {
  const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
    //returns modified data rather than original
    new: true,
    //appies schema validators
    runValidators: true,
  });

  if (!hotel) {
    return next(new AppError("No hotel found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      hotel,
    },
  });
});

//route handler - delete Hotels
exports.deleteHotel = catchAsync(async (req, res, next) => {
  const hotel = await Hotel.findByIdAndDelete(req.params.id, {
    //returns modified data rather than original
    new: true,
    //appies schema validators
    runValidators: true,
  });

  if (!hotel) {
    return next(new AppError("No hotel found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: {},
  });
});
