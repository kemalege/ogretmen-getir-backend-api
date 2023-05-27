const express = require('express');
const { createNewCourse, editCourse, enrolCourse, disEnrolCourse, deleteCourse, getAllCourses, getCourseById, getOwnerCourses, getEnrolledCourses } = require('../controllers/course');
const { getAccessToRoute, getInstructorAccess, getCourseOwnerAccess, getStudentAccess } = require('../middlewares/authorization/auth');
const courseQueryMiddleware = require('../middlewares/query/courseQueryMiddleware');
const Course = require('../models/Course');

const router = express.Router();

router.get("/mycourses",[getAccessToRoute], getOwnerCourses);
router.get("/enrolledcourses",[getAccessToRoute], getEnrolledCourses);
router.post("/",[getAccessToRoute, getInstructorAccess], createNewCourse);
router.get("/", courseQueryMiddleware(Course, {
    population: [
        {
            path: 'instructor',
            select: 'name profile_image'
        }
    ]
}), getAllCourses)
router.delete("/:id/delete",[getAccessToRoute, getCourseOwnerAccess], deleteCourse);
router.get("/:id", getCourseById);
router.post("/:id/edit", [getAccessToRoute, getCourseOwnerAccess], editCourse);
router.post("/:id/enrol", [getAccessToRoute, getStudentAccess], enrolCourse);
router.delete("/:id/disenrol", [getAccessToRoute, getStudentAccess], disEnrolCourse);

module.exports = router