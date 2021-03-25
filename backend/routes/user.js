const express = require("express");
const router = express.Router();
const bouncer = require("express-bouncer")(120000, 1.8e6, 5);
const auth = require("../middleware/auth");

bouncer.blocked = function (req, res, next, remaining) {
  res.send(
    429,
    "Too many requests have been made, " +
      "please wait " +
      remaining / 1000 +
      " seconds"
  );
};

const userCtrl = require("../controllers/user");
const regex = require("../middleware/regex");

router.get("/:id", auth, userCtrl.getOneUser);
router.post("/signup", regex.Validation, userCtrl.signup);
router.post("/login", regex.Validation, userCtrl.login);
router.put("/:id", auth, regex.Validation, userCtrl.modifyUser);
router.delete(
  "/:id",
  auth,
  userCtrl.deleteUserComment,
  userCtrl.deleteUserPost,
  userCtrl.deleteUser
);

module.exports = router;
