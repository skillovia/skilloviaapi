const express = require("express");
const {
  publishSkill,
  unPublishSkill,
  deleteSkill,
  retrievePublishedSkill,
  retrieveUnpublishedSkill,
  retrieveUserSkills,
  // registerUser,
  updateUser,
  getAllusers,
  getProfileByUserId,
  changeUserRole,
  approveKycStatus,
  getAllAdminusers,
  rejectKycStatus,
  retrieveUserKyc,
  login,
  registerAnyUser,
  retrievePendingKyc,
  retrieveApprovedKyc,
  removeKyc,
  addSkillCategory,
  getSkillCategory,
} = require("../controllers/adminController");
const router = express.Router();
const verify = require("../middlewares/verifyToken");
const isAdmin = require("../middlewares/isAdmin");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    // acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const filename =
        "skill-thumbnails/" +
        Date.now().toString() +
        "-" +
        file.originalname.replace(/\s+/g, "-");
      cb(null, filename);
    },
  }),
});

router.post(
  "/skills/add/category",
  verify,

  upload.single("thumbnail"),
  addSkillCategory
);

// router.post("/users/create/account", verify, registerUser);
router.post("/users/create/any-account", registerAnyUser);
router.post("/admin-login", login);
router.get("/skills/user/:id", verify, retrieveUserSkills);
router.get("/skills/get/published", verify, retrievePublishedSkill);
router.get(
  "/skills/get/unpublished",
  verify,

  retrieveUnpublishedSkill
);

router.get("/skills/get/categories", verify, getSkillCategory);

router.get("/kyc/user/:user_id", verify, retrieveUserKyc);
router.get("/kyc/pending", verify, retrievePendingKyc);
router.get("/kyc/approved", verify, retrieveApprovedKyc);
router.get("/users/get/all", verify, getAllusers);
router.get("/users-admin/get/all", verify, getAllAdminusers);
router.get("/users/get/profile/:id", verify, getProfileByUserId);
router.put("/users/change/role/:user_id", verify, changeUserRole);
router.put("/skills/publish/:id", verify, publishSkill);
router.put("/skills/unpublish/:id", verify, unPublishSkill);
router.put("/users/update/account/:id", verify, updateUser);
router.put("/kyc/approve/:id", verify, approveKycStatus);
router.put("/kyc/reject/:id", verify, rejectKycStatus);

router.delete("/kyc/delete/:id", verify, removeKyc);
router.delete("/skills/delete/:id", verify, deleteSkill);
module.exports = router;
