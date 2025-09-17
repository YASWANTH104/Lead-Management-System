const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
} = require("../controllers/auth-controller");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", currentUser);

module.exports = router;
