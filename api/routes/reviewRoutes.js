const express = require("express");
const router = express.Router();
const verify = require("../middlewares/verifyToken");
const {
  createReview,
  getReviewsForUser,
  getSkillReviewsForUser,
  getSkillReviewsByUser,
} = require("../controllers/reviewController");

// POST a review (after booking)
router.post("/", verify, createReview);

// GET all reviews for a user
router.get("/user/:id", verify, getReviewsForUser);
// router.get("/skill/:skillId", verify, getSkillReviewsForUser);
// GET all reviews for a specific skill of a specific user
router.get("/skill/:skillId/user/:userId", verify, getSkillReviewsForUser);

module.exports = router;
