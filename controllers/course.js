const CustomError = require("../helpers/error/CustomError");
const User = require("../models/User");
const asyncErrorWrapper = require("express-async-handler");
const Comment = require("../models/Comment");
const Course = require("../models/Course");

const createNewCourse = asyncErrorWrapper(async (req, res, next) => {
  const course_info = req.body;

  const instructor = await User.findById(req.user.id);

  const course = await Course.create({
    ...course_info,
    instructor: req.user.id,
  });

  instructor.courses.push(course.id)
  await instructor.save()

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
  const user = await User.findById(studentId);

  if (course.students.includes(studentId)) {
    return next(
      new CustomError("You are already enrolled in this course", 400)
    );
  }
  const enrollmentCount = course.students.length;
  if (course.quota <= enrollmentCount) {
    return next(new CustomError("This course is full", 400));
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
const getCourseById = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const course = await Course.findById(id).populate({
    path: "instructor",
    select: "name profile_img",
  });
  if (!course) {
    return next(new CustomError("Course Not Found", 400));
  }
  const enrollmentCount = course.students.length
  const courseResponse = { ...course.toObject(), enrollmentCount }
  
  res.status(200).json({
    success: true,
    data: courseResponse
  });
});

module.exports = {
  createNewCourse,
  editCourse,
  enrolCourse,
  disEnrolCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
};
