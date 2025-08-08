// routes/adminRoutes.js
import express from "express";
import { body, param, query } from "express-validator";
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getSystemStats,
  getAdminDashboard,
  bulkUpdateUsers,
  exportUsers,
} from "../controllers/adminController.js";
import {
  authenticateFirebaseToken,
  authorize,
  checkPermissions,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Validation middleware
const updateRoleValidation = [
  body("role")
    .isIn(["user", "moderator", "admin"])
    .withMessage("Role must be user, moderator, or admin"),
  body("reason")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Reason must not exceed 500 characters"),
];

const updateStatusValidation = [
  body("status")
    .isIn(["active", "inactive", "suspended", "pending"])
    .withMessage("Status must be active, inactive, suspended, or pending"),
  body("reason")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Reason must not exceed 500 characters"),
];

const bulkUpdateValidation = [
  body("userIds")
    .isArray({ min: 1 })
    .withMessage("User IDs must be an array with at least one element"),
  body("updates").isObject().withMessage("Updates must be an object"),
];

// All admin routes require admin role
router.use(authenticateFirebaseToken, authorize("admin"));

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard data
// @access  Private (Admin)
router.get("/dashboard", getAdminDashboard);

// @route   GET /api/admin/stats
// @desc    Get system statistics
// @access  Private (Admin)
router.get("/stats", getSystemStats);

// @route   GET /api/admin/users
// @desc    Get all users with advanced filtering (Admin only)
// @access  Private (Admin)
router.get(
  "/users",
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("role").optional().isIn(["user", "moderator", "admin"]),
    query("status")
      .optional()
      .isIn(["active", "inactive", "suspended", "pending"]),
    query("search").optional().isLength({ min: 1, max: 100 }),
    query("sortBy")
      .optional()
      .isIn(["createdAt", "lastActiveAt", "email", "role"]),
    query("sortOrder").optional().isIn(["asc", "desc"]),
  ],
  getAllUsers
);

// @route   GET /api/admin/users/:id
// @desc    Get user by ID (Admin only)
// @access  Private (Admin)
router.get(
  "/users/:id",
  [param("id").notEmpty().withMessage("User ID is required")],
  getUserById
);

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role (Admin only)
// @access  Private (Admin)
router.put("/users/:id/role", updateUserRole);

// @route   PUT /api/admin/users/:id/status
// @desc    Update user status (Admin only)
// @access  Private (Admin)
router.put(
  "/users/:id/status",
  [
    param("id").notEmpty().withMessage("User ID is required"),
    ...updateStatusValidation,
  ],
  updateUserStatus
);

// @route   DELETE /api/admin/users/:id
// @desc    Delete user (Admin only)
// @access  Private (Admin)
router.delete(
  "/users/:id",
  [param("id").notEmpty().withMessage("User ID is required")],
  deleteUser
);

// @route   POST /api/admin/users/bulk-update
// @desc    Bulk update users (Admin only)
// @access  Private (Admin)
router.post("/users/bulk-update", bulkUpdateValidation, bulkUpdateUsers);

// @route   GET /api/admin/users/export
// @desc    Export users data (Admin only)
// @access  Private (Admin)
router.get(
  "/users/export",
  [
    query("format").optional().isIn(["csv", "json"]),
    query("role").optional().isIn(["user", "moderator", "admin"]),
    query("status")
      .optional()
      .isIn(["active", "inactive", "suspended", "pending"]),
  ],
  exportUsers
);

export default router;
