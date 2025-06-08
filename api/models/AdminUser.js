const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminUserSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    gender: { type: String },
    password: { type: String, required: true, minlength: 8 },
    photourl: { type: String, default: null },
    refreshToken: { type: String, default: null },

    role: { type: String, default: "admin" }, // hard-coded role
  },
  { timestamps: true }
);

adminUserSchema.statics.registerAdmin = async function (data) {
  const { phone, email, firstname, lastname, gender, password } = data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = new this({
    phone,
    email,
    firstname,
    lastname,
    gender,
    password: hashedPassword,
  });

  return await admin.save();
};

adminUserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

adminUserSchema.statics.findByEmail = async function (email) {
  return await this.findOne({ email });
};
adminUserSchema.statics.storeRefreshToken = async function (userId, token) {
  return await this.findByIdAndUpdate(userId, { refreshToken: token });
};
module.exports = mongoose.model("AdminUser", adminUserSchema);
