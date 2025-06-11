const Review = require("../models/Review");

// exports.createReview = async (req, res) => {
//   const reviewerId = req.user.id;
//   const { bookingId, revieweeId, rating, comment } = req.body;

//   if (!bookingId || !revieweeId || !rating) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   try {
//     const review = await Review.create({
//       bookingId,
//       reviewerId,
//       revieweeId,
//       rating,
//       comment,
//     });

//     res.status(201).json({
//       status: "success",
//       message: "Review submitted",
//       data: review,
//     });
//   } catch (error) {
//     console.error("Error creating review:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// reviewController.js

exports.createReview = async (req, res) => {
  const reviewerId = req.user.id;
  const { skillId, revieweeId, rating, comment } = req.body;

  if (!skillId || !revieweeId || !rating) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const review = await Review.create({
      skillId,
      reviewerId,
      revieweeId,
      rating,
      comment,
    });

    res.status(201).json({
      status: "success",
      message: "Review submitted",
      data: review,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getReviewsForUser = async (req, res) => {
  // const userId = parseInt(req.params.id);
  const userId = req.params.id; // ✅ No parseInt
  try {
    const reviews = await Review.getReviewsForUser(userId);
    res.status(200).json({ status: "success", data: reviews });
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// exports.getSkillReviewsForUser = async (req, res) => {
//   const { skillId, userId } = req.params;

//   try {
//     const reviews = await Review.getReviewsForSkillAndUser(skillId, userId);

//     res.status(200).json({
//       status: "success",
//       data: reviews,
//     });
//   } catch (error) {
//     console.error("Error fetching reviews for skill and user:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// controllers/reviewController.js
exports.getSkillReviewsForUser = async (req, res) => {
  const { skillId } = req.params;
  const userId = req.user.id; // from verify middleware

  try {
    const reviews = await Review.getReviewsForSkillAndUser(skillId, userId);

    console.log("Skill:", skillId);
    console.log("User:", userId);
    console.log("Fetched reviews:", reviews);

    res.status(200).json({
      status: "success",
      data: reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews for skill and user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all reviews for a specific skill
// exports.getSkillReviewsForUser = async (req, res) => {
//   try {
//     const reviews = await Review.find({ skillId: req.params.skillId })
//       .populate("reviewerId", "name email") // Optional: populate reviewer details
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       status: "success",
//       data: reviews,
//     });
//   } catch (error) {
//     console.error("Error fetching reviews for skill:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
