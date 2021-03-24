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
router.post("/signup", regex.authValidation, regex.Validation, userCtrl.signup);
router.post("/login", regex.authValidation, userCtrl.login);
router.put(
  "/:id",
  auth,
  regex.authValidation,
  regex.Validation,
  userCtrl.modifyUser
);
router.delete("/:id", auth, userCtrl.deleteUser);

module.exports = router;
