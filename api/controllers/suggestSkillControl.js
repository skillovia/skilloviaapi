const SuggestSkill = require("../models/SuggestSkill");
const notificationController = require("./notificationController");

exports.createSuggestSkill = async (req, res) => {
  const userId = req.user.id;
  const data = req.body;

  try {
    const suggest_skill = await SuggestSkill.findSuggestedSkill(data.name);
    if (suggest_skill != null) {
      return res.status(400).json({
        status: "error",
        message: "Skill already exists",
        data: null,
      });
    }

    const skill = await SuggestSkill.createSuggestion(userId, data);
    return res.status(200).json({
      status: "success",
      message: "Skill added successfully.",
      data: skill,
    });
  } catch (error) {
    console.error("SuggestSkill Error:", error); // Add this line to debug
    return res.status(500).json({
      status: "error",
      message: "Failed to add skill.",
    });
  }
};

// exports.updateStatus = async (req, res) => {
//   const updates = req.body;
//   const skillId = parseInt(req.params.id);

//   try {
//     const skill = await SuggestSkill.updateStatus(skillId, updates);

//     res.status(200).json({
//       status: "success",
//       message: "Status updated successfully.",
//       data: skill,
//     });

//     const findSkill = await SuggestSkill.updateStatus(skillId);
//     const skillUserId = findSkill.user_id;
//     await notificationController.storeNotification(skillUserId);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ status: "error", message: "Failed to update suggested skill." });
//   }
// };

exports.updateStatus = async (req, res) => {
  const updates = req.body;
  const skillId = req.params.id;

  try {
    // Update the skill's status
    const updatedSkill = await SuggestSkill.updateStatus(skillId, updates);

    res.status(200).json({
      status: "success",
      message: "Status updated successfully.",
      data: updatedSkill,
    });

    // ✅ Send notification only if status is approved
    if (updates.status === "approved") {
      const skillUserId = updatedSkill.user_id;
      await notificationController.storeNotification({
        userId: skillUserId,
        title: "Skill Approved",
        description: `Your suggested skill "${updatedSkill.name}" has been approved.`,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to update suggested skill.",
    });
  }
};

exports.deleteSuggestSkill = async (req, res) => {
  const userId = req.user.id;
  // const skillId = parseInt(req.params.id);

  const skillId = req.params.id;
  try {
    const skill = await SuggestSkill.delete(skillId);
    res.status(200).json({
      status: "success",
      message: "Suggested skill deleted successfully.",
      data: skill,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Failed to delete suggested skill." });
  }
};

exports.retrieveSuggestedSkills = async (req, res) => {
  const status = req.params.status;

  try {
    const skill = await SuggestSkill.retrieveSuggestedSkills(status);

    if (skill && skill.length > 0) {
      res.status(200).json({
        status: "success",
        message: "Suggested skills retrieved successfully.",
        data: skill,
      });
    } else {
      res
        .status(200)
        .json({ status: "success", message: "No record found", data: null });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve Suggested skills",
    });
  }
};
