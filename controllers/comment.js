const CustomError = require("../helpers/error/CustomError");
const User = require("../models/User");
const asyncErrorWrapper = require("express-async-handler");
const Comment = require("../models/Comment");

const addNewCommentToUser = asyncErrorWrapper(async (req, res, next) => {
  const { user_id } = req.params;
  const information = req.body;

  const comment = await Comment.create({
    ...information,
    owner: req.user.id,
    sent: user_id,
  });

  res.status(200).json({
    success: true,
    data: comment,
  });
});

const getAllCommentsByUser = asyncErrorWrapper(async (req, res, next) => {
  const { user_id } = req.params;

  const user = await User.findById(user_id).populate("comments");

  const comments = user.comments;

  res.status(200).json({
    status: true,
    count: comments.length,
    data: comments,
  });
});

const editComment = asyncErrorWrapper(async (req, res, next) => {
  const {comment_id} = req.params;
  
  const {content} = req.body;

  let comment = await Comment.findById(comment_id)

  comment.content = content

  await comment.save();

  return res.status(200).json({
      success: true,
      data: comment
    });
});

const deleteComment = asyncErrorWrapper(async (req, res, next) => {
  const {comment_id} = req.params;

  const {user_id} = req.params;
  
  await Comment.findByIdAndRemove(comment_id)

  const user = await User.findById(user_id)

  user.comments.splice(user.comments.indexOf(comment_id),1)

  user.save()

  return res.status(200).json({
      success: true,
      message: "Comment deleted successfully"
    });
});

module.exports = {addNewCommentToUser, getAllCommentsByUser, editComment, deleteComment };
