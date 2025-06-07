const Skill = require("../models/Skill");
const User = require("../models/User");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // or 'bcryptjs' if you use that package

class Admin {
  /** ----------- SKILLS ------------ */

  static async publishSkill(skillId, status) {
    return await Skill.findByIdAndUpdate(
      skillId,
      { approval_status: status },
      { new: true }
    );
  }

  static async unPublishSkill(skillId, status) {
    return await Skill.findByIdAndUpdate(
      skillId,
      { approval_status: status },
      { new: true }
    );
  }

  static async deleteSkill(skillId) {
    return await Skill.findByIdAndDelete(skillId);
  }

  static async retrieveSkillByStatus(status) {
    return await Skill.find({ approval_status: status })
      .populate("user_id", "firstname lastname email photourl")
      .lean();
  }

  static async retrieveUserSkills(userId) {
    return await Skill.find({ user_id: userId })
      .populate("user_id", "firstname lastname")
      .lean();
  }

  static async findSkill(id) {
    return await Skill.findById(id);
  }

  /** ----------- USERS ------------ */

  static async createUser(data) {
    const { phone, email, firstname, lastname, gender, password } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const code = Math.floor(1000 + Math.random() * 900000);
    const referralCode = firstname + code;

    const newUser = new User({
      phone,
      email,
      firstname,
      lastname,
      gender,
      password: hashedPassword,
      is_email_verified: true,
      referral_code: referralCode,
    });

    return await newUser.save();
  }

  static async createAnyUser(data, options = {}) {
    const { phone, email, firstname, lastname, gender, password } = data;
    const { role_id } = options;

    const hashedPassword = await bcrypt.hash(password, 10);
    const code = Math.floor(1000 + Math.random() * 900000);
    const referralCode = firstname + code;

    const newUser = new User({
      phone,
      email,
      firstname,
      lastname,
      gender,
      password: hashedPassword,
      is_email_verified: true,
      referral_code: referralCode,
      role_id: role_id || 2, // Default to normal user role_id = 2 if not provided
    });

    return await newUser.save();
  }

  //   static async addSkillCategory(data, thumbnail) {
  //     const { title, description } = data;
  //     const status = "published";

  //     const result = await pool.query(
  //       `
  //             INSERT INTO skills_category (
  //             title, description, thumbnail, status
  //             ) VALUES ($1, $2, $3, $4)
  //             RETURNING *
  //             `,
  //       [title, description, thumbnail, status]
  //     );

  //     return result.rows[0];
  //   }

  static async addSkillCategory(data, thumbnail) {
    const { title, description } = data;
    const skillCategory = new SkillCategory({
      title,
      description,
      thumbnail,
      status: "published",
    });

    return await skillCategory.save();
  }
  static async checkUserExist(phone, email) {
    return await User.findOne({
      $or: [{ phone }, { email }],
    });
  }

  static async updateUser(userId, updates) {
    const { email, firstname, lastname, gender, password } = updates;
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;

    const updateData = {
      ...(email && { email }),
      ...(firstname && { firstname }),
      ...(lastname && { lastname }),
      ...(gender && { gender }),
      ...(hashedPassword && { password: hashedPassword }),
    };

    return await User.findByIdAndUpdate(userId, updateData, { new: true });
  }
}

module.exports = Admin;
