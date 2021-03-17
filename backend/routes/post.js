const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const postCtrl = require("../controllers/post");
const regex = require("../middleware/regex");

router.get("/", auth, postCtrl.getAllPosts);
router.get("/:id", auth, postCtrl.getOnePost);
router.post("/", regex.Validation, auth, postCtrl.createPost);
router.post("/:id/comment", auth, regex.Validation postCtrl.commentPost);
router.put("/:id", regex.Validation, auth, postCtrl.modifyPost);
router.delete("/:id", auth, postCtrl.deletePost);

module.exports = router;