const Messages = require("../models/Messages");
const Notification = require("../models/Notifications");

// for testing purposes
// exports.sendMessage = async (req, res) => {
//   try {
//     if (
//       req.body.senderId != null &&
//       req.body.receiverId != null &&
//       req.body.content != null
//     ) {
//       const message = await Messages.store(req.body);
//       // ✅ Create a notification for the receiver
//       await Notification.create({
//         userId: receiverId,
//         title: "New Message",
//         description: `You have a new message from user ${senderId}`,
//       });
//       res.status(200).json({
//         status: "success",
//         message: "messages sent successfully.",
//         data: message,
//       });
//     } else {
//       res
//         .status(200)
//         .json({ status: "failed", message: "Missing parameter", data: null });
//     }
//   } catch (error) {
//     res.status(500).json({
//       status: "error",
//       message: "Failed to retrieve messages",
//       data: error,
//     });
//   }
// };
exports.sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;

    if (senderId && receiverId && content) {
      const message = await Messages.store({ senderId, receiverId, content });

      // ✅ Create a notification for the receiver
      await Notification.store(
        receiverId,
        "New Message",
        `You have a new message from user ${senderId}`
      );

      res.status(200).json({
        status: "success",
        message: "Message sent successfully.",
        data: message,
      });
    } else {
      res.status(400).json({
        status: "failed",
        message: "Missing parameter(s)",
        data: null,
      });
    }
  } catch (error) {
    console.error("Send Message Error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to send message",
      data: error.message,
    });
  }
};

// exports.retrieveMessage = async (req, res) => {
//   const senderId = parseInt(req.params.senderId);
//   const receiverId = parseInt(req.params.receiverId);

//   try {
//     if (senderId != null && receiverId != null) {
//       const message = await Messages.retrieveMessage(senderId, receiverId);
//       res
//         .status(200)
//         .json({
//           status: "success",
//           message: "messages retrieved successfully.",
//           data: message,
//         });
//     } else {
//       res
//         .status(200)
//         .json({ status: "failed", message: "Missing parameter", data: null });
//     }
//   } catch (error) {
//     res
//       .status(500)
//       .json({
//         status: "error",
//         message: "Failed to retrieve messages",
//         data: error,
//       });
//   }
// };

exports.retrieveMessage = async (req, res) => {
  const senderId = req.params.senderId;
  const receiverId = req.params.receiverId;

  try {
    if (senderId && receiverId) {
      const message = await Messages.retrieveMessage(senderId, receiverId);
      res.status(200).json({
        status: "success",
        message: "Messages retrieved successfully.",
        data: message,
      });
    } else {
      res.status(400).json({
        status: "failed",
        message: "Missing sender or receiver ID",
        data: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve messages",
      data: error.message,
    });
  }
};

exports.markAsRead = async (req, res) => {
  // const messageId = parseInt(req.params.messageId);
  const messageId = req.params.messageId;

  try {
    if (messageId != null) {
      const message = await Messages.markAsRead(messageId);
      res.status(200).json({
        status: "success",
        message: "messages updated successfully.",
        data: message,
      });
    } else {
      res
        .status(200)
        .json({ status: "failed", message: "Missing parameter", data: null });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to update messages",
      data: error,
    });
  }
};

// exports.retrieveChatUsers = async (req, res) => {
//     const userId = req.user.id;

//     try {
//         if (userId != null) {
//             const chatUsers = await Messages.retrieveChatUsers(userId);
//             res.status(200).json({status: 'success', message: 'Chat users with details retrieved successfully.', data: chatUsers});
//         } else {
//             res.status(400).json({status: 'failed', message: 'Missing or invalid parameter.', data: null});
//         }
//     } catch (error) {
//         res.status(500).json({status: 'error', message: 'Failed to retrieve chat users with details.', data: error.message});
//     }
// };

exports.retrieveChatUsers = async (req, res) => {
  console.log("Headers:", req.headers);
  console.log("User from token:", req.user);

  const userId = req.user?.id;

  try {
    if (userId != null) {
      const chatUsers = await Messages.retrieveChatUsers(userId);
      return res.status(200).json({
        status: "success",
        message: "Chat users with details retrieved successfully.",
        data: chatUsers,
      });
    } else {
      console.warn("Missing or invalid userId:", userId);
      return res.status(400).json({
        status: "failed",
        message: "Missing or invalid parameter.",
        data: null,
      });
    }
  } catch (error) {
    console.error("Error in retrieveChatUsers:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to retrieve chat users with details.",
      data: error.message,
    });
  }
};
