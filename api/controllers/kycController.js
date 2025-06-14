const Kyc = require("../models/Kyc");
const Notification = require("../models/Notifications");
// exports.uploadIdentity = async (req, res) => {
//   const userId = req.user.id;
//   const method = 'identification';
//   const { type } = req.body;

//   if(req.filePaths != null){
//     const filePath = req.filePaths;
//     const file = filePath.slice(15);

//     try {
//         const docs = await Kyc.upload(userId, method, type, file);
//         res.status(200).json({ status: 'success', message: 'Kyc document uploaded successfully.', data: docs });
//     } catch (error) {
//         res.status(500).json({status: 'error', message: 'Failed to upload document.', data: error });
//     }

//   } else {
//     res.status(400).send({
//         status: 'error',
//         message: 'No image found',
//         data: null
//     });
//   }
// };

// exports.uploadUtilityBill = async (req, res) => {
//     const userId = req.user.id;
//     const method = 'utility-bill';
//     const type = 'utility-bill';

//     if(req.filePaths != null){
//       const filePath = req.filePaths;
//       const file = filePath.slice(15);

//       try {
//           const docs = await Kyc.upload(userId, method, type, file);
//           res.status(200).json({ status: 'success', message: 'Kyc document uploaded successfully.', data: docs });
//       } catch (error) {
//           res.status(500).json({status: 'error', message: 'Failed to upload document.', data: error });
//       }

//     } else {
//       res.status(400).send({
//           status: 'error',
//           message: 'No image found',
//           data: null
//       });
//     }
// };
exports.getAllKyc = async (req, res) => {
  try {
    const allKycRecords = await Kyc.find().populate("userId", "name email"); // populate user details if needed
    res.status(200).json({
      status: "success",
      message: "All KYC records retrieved successfully.",
      data: allKycRecords,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve KYC records.",
      error: error.message,
    });
  }
};

exports.uploadIdentity = async (req, res) => {
  const userId = req.user.id;
  const method = "identification";
  const { type } = req.body;

  if (req.file) {
    const fileUrl = req.file.location; // S3 URL of uploaded file

    try {
      const docs = await Kyc.upload(userId, method, type, fileUrl);
      res.status(200).json({
        status: "success",
        message: "KYC document uploaded successfully.",
        data: docs,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Failed to upload document.",
        data: error,
      });
    }
  } else {
    res
      .status(400)
      .json({ status: "error", message: "No image found", data: null });
  }
};

exports.uploadUtilityBill = async (req, res) => {
  const userId = req.user.id;
  const method = "utility-bill";
  const type = "utility-bill";

  if (req.file) {
    const fileUrl = req.file.location; // S3 URL of uploaded file

    try {
      const docs = await Kyc.upload(userId, method, type, fileUrl);
      res.status(200).json({
        status: "success",
        message: "KYC document uploaded successfully.",
        data: docs,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Failed to upload document.",
        data: error,
      });
    }
  } else {
    res
      .status(400)
      .json({ status: "error", message: "No image found", data: null });
  }
};

exports.changeKycStatus = async (req, res) => {
  const { status, id } = req.body;

  try {
    const data = await Kyc.changeStatus(id, status);
    // if (status === "approved") {
    //   await Notification.create({
    //     userId: data.user_id, // Make sure your KYC schema has this field
    //     title: "KYC Approved",
    //     description: "Your KYC verification has been approved.",
    //   });
    // }
    if (status === "approved" || status === "rejected") {
      await Notification.create({
        userId: data.user_id,
        title: `KYC ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        description:
          status === "approved"
            ? "Your KYC verification has been approved."
            : "Your KYC verification was rejected. Please review and try again.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Kyc status updated successfully.",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to update status.",
      data: error,
    });
  }
};

exports.retrieveUserKycStatus = async (req, res) => {
  // const userId = parseInt(req.user.id);
  const userId = req.params.id; // ✅ No parseInt

  try {
    const data = await Kyc.getKycByUserId(userId);
    if (data != null) {
      res.status(200).json({
        status: "success",
        message: "kyc documents retrieved successfully.",
        data: data,
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "No kyc document found",
        data: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve kyc documents",
      data: error,
    });
  }
};

// get pending identity kyc
exports.retrievePendingIdentityKyc = async (req, res) => {
  const method = "identification";
  const status = "pending";

  try {
    const data = await Kyc.getKycs(method, status);
    if (data != null) {
      res.status(200).json({
        status: "success",
        message: "kyc documents retrieved successfully.",
        data: data,
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "No pending kyc document found",
        data: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve kyc documents",
      data: error,
    });
  }
};

// get pending utility kyc
exports.retrievePendingUtilityKyc = async (req, res) => {
  const method = "utility-bill";
  const status = "pending";

  try {
    const data = await Kyc.getKycs(method, status);
    if (data != null) {
      res.status(200).json({
        status: "success",
        message: "kyc documents retrieved successfully.",
        data: data,
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "No pending kyc document found",
        data: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve kyc documents",
      data: error,
    });
  }
};

// get approved identity kyc
exports.retrieveApprovedIdentityKyc = async (req, res) => {
  const method = "identification";
  const status = "approved";

  try {
    const data = await Kyc.getKycs(method, status);
    if (data != null) {
      res.status(200).json({
        status: "success",
        message: "kyc documents retrieved successfully.",
        data: data,
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "No pending kyc document found",
        data: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve kyc documents",
      data: error,
    });
  }
};

// get approved utility kyc
exports.retrieveApprovedUtilityKyc = async (req, res) => {
  const method = "utility-bill";
  const status = "approved";

  try {
    const data = await Kyc.getKycs(method, status);
    if (data != null) {
      res.status(200).json({
        status: "success",
        message: "kyc documents retrieved successfully.",
        data: data,
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "No pending kyc document found",
        data: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve kyc documents",
      data: error,
    });
  }
};

// get identity kyc
exports.retrieveUserIdentityKyc = async (req, res) => {
  const method = "identification";
  const userId = req.user.id;

  try {
    const data = await Kyc.getUserKyc(userId, method);
    if (data != null) {
      res.status(200).json({
        status: "success",
        message: "kyc documents retrieved successfully.",
        data: data,
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "No kyc document found",
        data: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve kyc documents",
      data: error,
    });
  }
};

// get utility kyc
exports.retrieveUserUtilityKyc = async (req, res) => {
  const method = "utility-bill";
  const userId = req.user.id;

  try {
    const data = await Kyc.getUserKyc(userId, method);
    if (data != null) {
      res.status(200).json({
        status: "success",
        message: "kyc documents retrieved successfully.",
        data: data,
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "No kyc document found",
        data: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve kyc documents",
      data: error,
    });
  }
};

exports.removeUserUtilityKyc = async (req, res) => {
  const userId = req.user.id;
  // const id = parseInt(req.params.id);

  const id = req.params.id; // Keep it as a string

  const method = "utility-bill";

  try {
    const data = await Kyc.deleteKyc(userId, id, method);
    res.status(200).json({
      status: "success",
      message: "KYC document removed successfully.",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to remove KYC document.",
      data: error,
    });
  }
};

exports.removeUserIdentificationKyc = async (req, res) => {
  const userId = req.user.id;
  // const id = parseInt(req.params.id);
  const id = req.params.id; // Keep it as a string

  const method = "identification";

  try {
    const data = await Kyc.deleteKyc(userId, id, method);
    res.status(200).json({
      status: "success",
      message: "KYC document removed successfully.",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to remove KYC document.",
      data: error,
    });
  }
};
