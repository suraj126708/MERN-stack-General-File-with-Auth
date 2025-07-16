const {
  signUp,
  login,
  getProfile,
  updateProfile,
  logout,
} = require("../controllers/AuthController.js");

const ensureAuthenticated = require("../middlewares/Auth");

const router = require("express").Router();

// Public routes
router.post("/signup", signUp);

router.post("/login", login);

// Protected routes (require authentication)
router.get("/profile", ensureAuthenticated, getProfile);

router.put("/profile", ensureAuthenticated, updateProfile);

router.post("/logout", ensureAuthenticated, logout);

// Token verification route
router.get("/verify", ensureAuthenticated, (req, res) => {
  res.json({
    message: "Token is valid",
    success: true,
    user: req.user,
  });
});

module.exports = router;
