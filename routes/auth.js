const express = require('express');
const { register, getUser, login, logout, forgotPassword, resetPassword, editUser } = require('../controllers/auth');
const { createPhoto } = require('../controllers/auth');
const { getAccessToRoute } = require('../middlewares/authorization/auth');
const { uploadPhoto } = require('../middlewares/library/cloudinary');
const router = express.Router();

router.post("/register", register);
router.get("/profile", getAccessToRoute, getUser);
router.post('/photo',[getAccessToRoute, uploadPhoto], createPhoto)
router.get("/logout", getAccessToRoute, logout);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword", resetPassword);
router.post("/login", login);
router.post("/edit", getAccessToRoute, editUser)

module.exports = router