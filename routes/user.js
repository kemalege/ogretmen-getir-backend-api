const express = require('express');
const { getSingleUser, getAllUsers, getInstructors, getStudents, giveStarToUser, undoStarFromUser } = require('../controllers/user');
const { getAccessToRoute, selfAssesmentCheck } = require('../middlewares/authorization/auth');
const { checkUserExist } = require('../middlewares/database/databaseErrorHelpers');
const userQueryMiddleware = require('../middlewares/query/userQueryMiddleware');
const User = require('../models/User');
const comment = require('./comment')
const router = express.Router();

router.get("/", userQueryMiddleware(User, {
    population: {
        path : 'comment',
        select: 'title content'
    }
}), getAllUsers);
router.get("/instructor", getInstructors)
router.get("/student", getStudents)
router.get("/:id", checkUserExist, getSingleUser);
router.post("/:id/rate", [checkUserExist, getAccessToRoute, selfAssesmentCheck], giveStarToUser)
router.get("/:id/undorate", [checkUserExist, getAccessToRoute, selfAssesmentCheck], undoStarFromUser)
router.use("/:user_id/comments", checkUserExist, comment);


module.exports = router