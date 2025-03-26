const express = require("express");
const {
  getNotifications,
  getBookingNotifications,
  markNotificationAsSeen,
} = require("../controllers/notificationController");
const verify = require("../middlewares/verifyToken");
const router = express.Router();

router.get("/", verify, getNotifications);

// Get only booking notifications
router.get("/bookings", verify, getBookingNotifications);

// Mark a notification as seen
router.put("/:notificationId/seen", verify, markNotificationAsSeen);

module.exports = router;
