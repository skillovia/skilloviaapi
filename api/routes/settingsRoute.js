const express = require('express');
const {uploadIdentity, 
   uploadUtilityBill, 
   changeKycStatus, 
   retrieveUserKycStatus, 
   retrievePendingIdentityKyc,
   retrievePendingUtilityKyc, 
   retrieveApprovedIdentityKyc, 
   retrieveApprovedUtilityKyc,
   retrieveUserIdentityKyc,
   retrieveUserUtilityKyc,
   removeUserUtilityKyc,
   removeUserIdentificationKyc,
} = require('../controllers/kycController');

const {addBillingMethod, 
   retrieveBillingMethods, 
   removeBillingCard, 
   addWithdrawMethod,
   retrieveWithdrawalMethods, 
   removeWithdrawalAccount
} = require('../controllers/PaymentController')

const router = express.Router();
const verify = require("../middlewares/verifyToken")
const multer = require('multer');
const fs = require('fs');
const path = require('path');


const storage = multer.diskStorage({
  destination: function (req, file, callback) {
     const uploadDir = '/uploads/files';
     
     callback(null, __dirname + uploadDir);
  },
  filename: function (req, file, callback) {
     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
     const filename = uniqueSuffix + path.extname(file.originalname);
     const filePath = path.join(__dirname + '/uploads/files', filename);

     // Stores the file path in req
     if (!req.filePaths) {
        req.filePaths = null;
     }
     req.filePaths = filePath;

     callback(null, filename);
  }
});

const upload = multer({ storage: storage })


router.post('/kyc/upload/identity', verify, upload.single('file'), uploadIdentity);
router.post('/kyc/upload/utility', verify, upload.single('file'), uploadUtilityBill);
router.put('/kyc/admin/approve', verify, changeKycStatus);
router.get('/kyc/user/approve/status', verify, retrieveUserKycStatus);
router.get('/kyc/admin/id/pending', verify, retrievePendingIdentityKyc);
router.get('/kyc/admin/utility/pending', verify, retrievePendingUtilityKyc);
router.get('/kyc/admin/id/approved', verify, retrieveApprovedIdentityKyc);
router.get('/kyc/admin/utility/approved', verify, retrieveApprovedUtilityKyc);
router.post('/payment/billingmethod', verify, addBillingMethod);
router.get('/payment/billingmethods', verify, retrieveBillingMethods);
router.delete('/payment/billingmethod/:id', verify, removeBillingCard);
router.post('/payment/withdrawalmethod', verify, addWithdrawMethod);
router.get('/payment/withdrawalmethods', verify, retrieveWithdrawalMethods);
router.delete('/payment/withdrawalmethod/:id', verify, removeWithdrawalAccount);

router.get('/kyc/get/identity', verify, retrieveUserIdentityKyc);
router.get('/kyc/get/utility', verify, retrieveUserUtilityKyc);
router.delete('/kyc/delete/identity/:id', verify, removeUserIdentificationKyc);
router.delete('/kyc/delete/utility/:id', verify, removeUserUtilityKyc);
module.exports = router;
