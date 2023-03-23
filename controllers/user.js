const CustomError = require("../helpers/error/CustomError");
const User = require("../models/User");
const asyncErrorWrapper = require("express-async-handler");

const getSingleUser = asyncErrorWrapper(async (req, res, next) => {

  const user = req.data;

  return res.status(200).json({
    success: true,
    data: user,
  });
});

const getAllUsers = asyncErrorWrapper(async (req, res, next) => {
  res.status(200).json(res.queryResults);
});

const getInstructors = asyncErrorWrapper(async (req, res, next) => {
  const users = await User.find({ role: "instructor" });

  return res.status(200).json({
    success: true,
    data: users,
  });
});

const getStudents = asyncErrorWrapper(async (req, res, next) => {
  const users = await User.find({ role: "student" });

  return res.status(200).json({
    success: true,
    data: users,
  });
});

const giveStarToUser = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const {star} = req.body;

  const user = await User.findById(id);

  const currentUser = user.ratings.find((item) => item.user == req.user.id)

  if (currentUser) {
    return next(new CustomError("You have already gived star", 403));
  }

  user.ratings.push({
    user: req.user.id,
    star: star,
  });

  user.save();

  return res.status(200).json({
    success: true,
    data: star,
  });
});

const undoStarFromUser = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const {star} = req.body;

  const user = await User.findById(id);

  const currentUser = user.ratings.find((item) => item.user == req.user.id)

  if (!currentUser) {
    return next(new CustomError("You can not undo star from this user", 403));
  }

  const index = user.ratings.indexOf(currentUser)
  user.ratings.splice(index, 1);

  user.save();

  return res.status(200).json({
    success: true,
    data: "Undo star operation succesfull",
  });
});

module.exports = {
  getSingleUser,
  getAllUsers,
  getInstructors,
  getStudents,
  giveStarToUser,
  undoStarFromUser
};
