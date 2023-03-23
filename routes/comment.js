const express = require("express");
const { addNewCommentToUser, getAllCommentsByUser, editComment, deleteComment } = require("../controllers/comment");
const { getAccessToRoute, getAdminAcess, getCommentOwnerAccess } = require("../middlewares/authorization/auth");
const { checkUserExist, checkOwnerAndCommmentExist } = require("../middlewares/database/databaseErrorHelpers");

const router = express.Router({mergeParams: true});

router.post("/", getAccessToRoute, addNewCommentToUser)
router.get("/", getAllCommentsByUser)
router.put("/:comment_id/edit", [checkOwnerAndCommmentExist, getAccessToRoute, getCommentOwnerAccess], editComment)
router.delete("/:comment_id/delete", [checkOwnerAndCommmentExist, getAccessToRoute, getCommentOwnerAccess], deleteComment)

module.exports = router