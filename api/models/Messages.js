const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    markAsRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

// Store a new message
messageSchema.statics.store = async function (data) {
  const message = new this(data);
  return await message.save();
};

// Retrieve messages between two users ordered by createdAt
messageSchema.statics.retrieveMessage = async function (senderId, receiverId) {
  return await this.find({
    $or: [
      { senderId, receiverId },
      { senderId: receiverId, receiverId: senderId },
    ],
  })
    .sort({ createdAt: 1 })
    .exec();
};

// Mark a message as read by ID
messageSchema.statics.markAsRead = async function (messageId) {
  return await this.findByIdAndUpdate(
    messageId,
    { markAsRead: true },
    { new: true }
  ).exec();
};

messageSchema.statics.retrieveChatUsers = async function (userId) {
  const objectUserId = new mongoose.Types.ObjectId(userId); // ✅ Proper ObjectId instance

  return await this.aggregate([
    {
      $match: {
        $or: [{ senderId: objectUserId }, { receiverId: objectUserId }],
      },
    },
    {
      $project: {
        otherUserId: {
          $cond: [
            { $eq: ["$senderId", objectUserId] },
            "$receiverId",
            "$senderId",
          ],
        },
        content: 1,
        createdAt: 1,
        markAsRead: 1,
        senderId: 1,
        receiverId: 1,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: "$otherUserId",
        lastMessage: { $first: "$content" },
        lastMessageTime: { $first: "$createdAt" },
        unreadMessageCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$receiverId", objectUserId] },
                  { $eq: ["$markAsRead", false] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        user_id: "$_id",
        name: { $concat: ["$user.firstname", " ", "$user.lastname"] },
        email: "$user.email",
        photourl: "$user.photourl",
        unreadMessageCount: 1,
        lastMessage: 1,
        lastMessageTime: 1,
      },
    },
    {
      $sort: { lastMessageTime: -1 },
    },
  ]).exec();
};

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
