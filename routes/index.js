const express = require('express');
const router = express.Router();
const auth = require('./auth')
const user = require('./user')
const admin = require('./admin')
const course = require('./course')

router.use("/users", user);
router.use("/auth", auth);
router.use("/admin", admin)
router.use("/course", course);

module.exports = router