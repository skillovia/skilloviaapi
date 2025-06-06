const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const path = require("path");

// Get region from environment variable
const awsRegion = process.env.AWS_REGION;

// Initialize S3 client
const s3 = new S3Client({
  region: awsRegion,
  endpoint: `https://s3.${awsRegion}.amazonaws.com`, // ✅ Fixed this line
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Configure Multer to upload to S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "eduprosolution", // Replace with your actual S3 bucket name
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const uniqueFilename = `uploads/skills/${Date.now()}-${
        file.originalname
      }`;
      cb(null, uniqueFilename);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
