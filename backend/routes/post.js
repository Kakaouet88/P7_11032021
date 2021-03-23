const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const postCtrl = require("../controllers/post");
const regex = require("../middleware/regex");

router.get("/", postCtrl.getAllPosts);
router.get("/:id", auth, postCtrl.getOnePost);
router.post("/", auth, regex.Validation, postCtrl.createPost);
router.post("/:id", auth, regex.Validation, postCtrl.commentPost);
router.put("/:id", auth, regex.Validation, postCtrl.modifyPost);
router.delete("/:id", auth, postCtrl.deletePost);

module.exports = router;
