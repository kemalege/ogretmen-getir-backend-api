const CustomError = require("../helpers/error/CustomError");
const User = require("../models/User");
const asyncErrorWrapper = require("express-async-handler");
const Comment = require("../models/Comment");
const Course = require("../models/Course");

const createNewCourse = asyncErrorWrapper(async (req, res, next) => {
  const course_info = req.body;

  const course = await Course.create({
    ...course_info,
    instructor: req.user.id,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});

const getAllCourses = asyncErrorWrapper(async (req, res, next) => {
  res.status(200).json(res.queryResults);
});

const editCourse = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const course_info = req.body;

  const course = await Course.findByIdAndUpdate(
    id,
    {
      ...course_info,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    data: course,
  });
});

const enrolCourse = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const studentId = req.user.id;

  const course = await Course.findById(id);

  if (course.students.includes(studentId)) {
    return next(
      new CustomError("You are already enrolled in this course", 400)
    );
  }
  course.students.push(studentId);

  await course.save();

  res.status(200).json({
    success: true,
    data: course,
  });
});

const disEnrolCourse = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const studentId = req.user.id;

  const course = await Course.findById(id);

  if (!course.students.includes(studentId)) {
    return next(new CustomError("You can not disenrol from this course", 400));
  }
  const index = course.students.indexOf(studentId);
  course.students.splice(index, 1);

  await course.save();

  res.status(200).json({
    success: true,
    data: course,
  });
});

const deleteCourse = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;

  await Course.findByIdAndRemove(id);

  return res.status(200).json({
    success: true,
    message: "Course deleted successfully",
  });
});
module.exports = {
  createNewCourse,
  editCourse,
  enrolCourse,
  disEnrolCourse,
  deleteCourse,
  getAllCourses,
};
