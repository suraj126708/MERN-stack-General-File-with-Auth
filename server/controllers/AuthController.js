const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Helper function to process user data for response
const processUserForResponse = (user) => {
  const userObj = user.toObject ? user.toObject() : user;
  return {
    _id: userObj._id,
    username: userObj.username,
    email: userObj.email,
    profilePicture: userObj.profilePicture || null,
  };
};

// Sign Up Controller
const signUp = async (req, res) => {
  try {
    const { email, password, username, profilePicture } = req.body;

    // Validate required fields
    if (!email || !password || !username) {
      return res.status(400).json({
        message: "All required fields must be provided",
        success: false,
        required: ["email", "password", "username"],
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      const conflictField = existingUser.email === email ? "email" : "username";
      return res.status(409).json({
        message: `User already exists with this ${conflictField}`,
        success: false,
        field: conflictField,
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
        success: false,
      });
    }

    // Create new user
    const newUser = new User({
      email,
      username,
      password: await bcrypt.hash(password, 12),
      profilePicture: profilePicture || null,
    });

    await newUser.save();

    // Generate JWT token for immediate login
    const jwtToken = jwt.sign(
      {
        email: newUser.email,
        _id: newUser._id,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    // Return success response with user data (excluding password)
    const userResponse = processUserForResponse(newUser);
    res.status(201).json({
      message: "User registered successfully",
      success: true,
      token: jwtToken,
      user: userResponse,
    });
  } catch (err) {
    console.error("SignUp Error:", err);

    // Handle specific MongoDB errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(409).json({
        message: `This ${field} is already taken`,
        success: false,
        field: field,
      });
    }

    res.status(500).json({
      message: "Internal server error during registration",
      success: false,
    });
  }
};

// Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        success: false,
      });
    }

    // Find user by email
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      {
        email: user.email,
        _id: user._id,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    // Return success response
    const userResponse = processUserForResponse(user);
    res.status(200).json({
      message: "Login successful",
      success: true,
      token: jwtToken,
      user: userResponse,
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({
      message: "Internal server error during login",
      success: false,
    });
  }
};

// Get Current User Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    const userResponse = processUserForResponse(user);
    res.status(200).json({
      message: "Profile retrieved successfully",
      success: true,
      user: userResponse,
    });
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Update User Profile
const updateProfile = async (req, res) => {
  try {
    const { profilePicture } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Update profilePicture if provided
    if (profilePicture !== undefined) user.profilePicture = profilePicture;

    await user.save();

    const userResponse = processUserForResponse(user);
    res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user: userResponse,
    });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Logout (client-side token removal, but we can log it)
const logout = async (req, res) => {
  try {
    res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (err) {
    console.error("Logout Error:", err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

module.exports = {
  signUp,
  login,
  getProfile,
  updateProfile,
  logout,
};
