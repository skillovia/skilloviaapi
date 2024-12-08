const SuggestSkill = require("../models/SuggestSkill");

exports.createSuggestSkill = async (req, res) => {
  const userId = req.user.id;
  const data = req.body;

  try {
    const skill = await SuggestSkill.create(userId, data);
    res
      .status(200)
      .json({
        status: "success",
        message: "Skill added successfully.",
        data: skill,
      });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to add skill." });
  }
};

exports.updateStatus = async (req, res) => {
  const updates = req.body;
  const skillId = parseInt(req.params.id);

  try {
    const skill = await SuggestSkill.updateStatus(skillId, updates);
    res
      .status(200)
      .json({
        status: "success",
        message: "Status updated successfully.",
        data: skill,
      });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Failed to update suggested skill." });
  }
};

exports.deleteSuggestSkill = async (req, res) => {
  const userId = req.user.id;
  const skillId = parseInt(req.params.id);

  try {
    const skill = await SuggestSkill.delete(skillId);
    res
      .status(200)
      .json({
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
    res
      .status(200)
      .json({
        status: "success",
        message: "Suggested skills retrieved successfully.",
        data: skill,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "error",
        message: "Failed to retrieve Suggested skills",
      });
  }
};