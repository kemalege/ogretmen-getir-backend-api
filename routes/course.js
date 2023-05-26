const express = require('express');
const { createNewCourse, editCourse, enrolCourse, disEnrolCourse, deleteCourse, getAllCourses, getCourseById } = require('../controllers/course');
const { getAccessToRoute, getInstructorAccess, getCourseOwnerAccess, getStudentAccess } = require('../middlewares/authorization/auth');
const courseQueryMiddleware = require('../middlewares/query/courseQueryMiddleware');
const Course = require('../models/Course');

const router = express.Router();

router.post("/",[getAccessToRoute, getInstructorAccess], createNewCourse);
router.get("/", courseQueryMiddleware(Course, {
    population: [
        {
            path: 'instructor',
            select: 'name profile_img'
        }
    ]
}), getAllCourses)
router.delete("/:id/delete",[getAccessToRoute, getCourseOwnerAccess], deleteCourse);
router.get("/:id", getCourseById);
router.post("/:id/edit", [getAccessToRoute, getCourseOwnerAccess], editCourse);
router.post("/:id/enrol", [getAccessToRoute, getStudentAccess], enrolCourse);
router.get("/:id/disenrol", [getAccessToRoute, getStudentAccess], disEnrolCourse);

module.exports = router