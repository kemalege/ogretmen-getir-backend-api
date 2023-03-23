const express = require("express");
const { blockUser, deleteUser } = require("../controllers/admin");
const { getAccessToRoute, getAdminAcess } = require("../middlewares/authorization/auth");
const { checkUserExist } = require("../middlewares/database/databaseErrorHelpers");

const router = express.Router();

router.use([getAccessToRoute, getAdminAcess])

router.get("/block/:id", checkUserExist, blockUser)
router.delete("/deleteuser/:id", checkUserExist, deleteUser)


module.exports = router