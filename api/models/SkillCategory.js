// // models/SkillCategory.js
// const mongoose = require("mongoose");

// const skillCategorySchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     thumbnail: { type: String, required: true }, // S3 URL
//     status: {
//       type: String,
//       enum: ["draft", "published"],
//       default: "published",
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("SkillCategory", skillCategorySchema);
// models/SkillCategory.js
const mongoose = require("mongoose");

const skillCategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft", // change this line
    },
  },
  { timestamps: true }
);

// Static method to create a skill category
skillCategorySchema.statics.addSkillCategory = async function (
  data,
  thumbnail
) {
  const { title, description } = data;

  const skillCategory = new this({
    title,
    description,
    thumbnail,
    status: data.status || "draft",
  });

  return await skillCategory.save();
};

// Static method to retrieve skill categories by status
skillCategorySchema.statics.retrieveByStatus = async function (status) {
  return this.find({ status }).lean();
};

// Static method to publish a skill category
skillCategorySchema.statics.publish = async function (id) {
  return this.findByIdAndUpdate(id, { status: "published" }, { new: true });
};

// Static method to unpublish a skill category (set to draft)
skillCategorySchema.statics.unpublish = async function (id) {
  return this.findByIdAndUpdate(id, { status: "draft" }, { new: true });
};

// models/SkillCategory.js

// Add this static method to the schema
skillCategorySchema.statics.retrieveAll = async function () {
  return this.find({}).lean(); // No filter - gets all
};

module.exports = mongoose.model("SkillCategory", skillCategorySchema);

// module.exports = mongoose.model("SkillCategory", skillCategorySchema);
