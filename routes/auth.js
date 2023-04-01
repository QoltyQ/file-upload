const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware");
const {
  signup,
  login,
  refreshToken,
  getId,
  logout,
} = require("../controllers/auth");

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", verifyToken, logout);

router.get("/info", verifyToken, getId);

module.exports = router;
