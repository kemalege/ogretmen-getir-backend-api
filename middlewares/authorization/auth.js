const jwt = require("jsonwebtoken");
const { getAccessTokenFromHeader, isTokenIncluded } = require("../../helpers/authorization/tokenHelpers");
const CustomError = require("../../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const User = require("../../models/User");
const Comment = require("../../models/Comment");
const Course = require("../../models/Course");

const getAccessToRoute = (req, res, next) => {
    const { JWT_SECRET_KEY } = process.env;
  
    if (!isTokenIncluded(req)) {
      return next(
        new CustomError("You are not authorized to access this route", 401)
      );
    }
    const accessToken = getAccessTokenFromHeader(req);
  
    jwt.verify(accessToken, JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return next(
          new CustomError("You are not authorized to access this route", 401)
        );
      }
      req.user = {
        id: decoded.id,
        name: decoded.name,
      };
      
      next();
    });
  };

  const getAdminAcess = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.user;
  
    const user = await User.findById(id);
  
    if (user.role !== "admin") {
      return next(new CustomError("Only admins can access this route", 403));
    }
    next();
  });

  const getCommentOwnerAccess = asyncErrorWrapper(async (req, res, next) => {
    const userId = req.user.id;
    const commentId = req.params.comment_id;
  
    const comment = await Comment.findById(commentId);
  
    if (comment.owner != userId) {
      return next(new CustomError("Only owner can handle this operation", 403));
    }
    next();
  });
  
  const getInstructorAccess = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.user;
  
    const user = await User.findById(id);
  
    if (user.role !== "instructor") {
      return next(new CustomError("Only instructors can access this route", 403));
    }
    next();
  });

  const getStudentAccess = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.user;
  
    const user = await User.findById(id);
  
    if (user.role !== "student") {
      return next(new CustomError("Only students can access this route", 403));
    }
    next();
  });

  const getCourseOwnerAccess = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;

    const course = await Course.findById(id);
    const userId = req.user.id

    console.log(course.instructor)
  
    if (course.instructor != userId ) {
      return next(new CustomError("Only owner can handle this operation", 403));
    }
    next();
  });

  const selfAssesmentCheck = asyncErrorWrapper(async (req, res, next) => {
    
    if (req.user.id == req.params.id) {
      return next(new CustomError("You can not perform this operation for yourself.", 403));
    }
    next();
  });


  module.exports = {getAccessToRoute, getAdminAcess, getCommentOwnerAccess, getInstructorAccess, getCourseOwnerAccess, getStudentAccess, selfAssesmentCheck}