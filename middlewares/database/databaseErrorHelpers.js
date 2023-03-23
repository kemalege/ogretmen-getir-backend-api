const CustomError = require("../../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const User = require("../../models/User");
const Comment = require("../../models/Comment");

const checkUserExist = asyncErrorWrapper(async (req, res, next) => {
  const id  = req.params.id || req.params.user_id;
  const user = await User.findById(id);

  if (!user) {
    return next(new CustomError("There is no such user with that id", 400));
  }
  req.data = user;
  next();
});

const checkOwnerAndCommmentExist = asyncErrorWrapper(async (req, res, next) => {
  const user_id = req.params.user_id;
  const comment_id = req.params.comment_id;
  
  const comment = await Comment.findOne({
    _id: comment_id,
    owner : user_id
  })
  if(!comment) {
    return next(new Error('There is no comment with that id associated with that user id', 400));
  }
  next()
});
module.exports = {checkUserExist, checkOwnerAndCommmentExist}