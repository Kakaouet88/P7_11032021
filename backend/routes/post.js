const express = require("express");
const router = express.Router();
const multerconf = require("../middleware/multer-config");

const auth = require("../middleware/auth");

const postCtrl = require("../controllers/post");
const regex = require("../middleware/regex");

router.get("/", auth, postCtrl.getAllPosts);
router.get("/:id", auth, postCtrl.getOnePost);
router.post("/", auth, multerconf, regex.Validation, postCtrl.createPost);
router.post("/:id", auth, regex.Validation, postCtrl.commentPost);
router.put("/:id", auth, multerconf, regex.Validation, postCtrl.modifyPost);
router.delete(
  "/:id",
  auth,
  multerconf,
  postCtrl.deletePostComment,
  postCtrl.deletePost
);
router.delete("/com/:id", auth, postCtrl.deleteCom);

module.exports = router;
