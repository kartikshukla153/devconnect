import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.userId;

    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Message content is required",
      });
    }

    let conversation = await Conversation.findOne({
      participants: {
        $all: [senderId, receiverId],
      },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content,
    });

    conversation.lastMessage = content;
    conversation.lastMessageAt = new Date();

    await conversation.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    console.log("SEND MESSAGE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const myId = req.user._id;
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        {
          sender: myId,
          receiver: otherUserId,
        },
        {
          sender: otherUserId,
          receiver: myId,
        },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    console.log("GET MESSAGES ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const markMessagesAsRead = async (req, res) => {
  try {
    const myId = req.user._id;
    const otherUserId = req.params.userId;

    const result = await Message.updateMany(
      {
        sender: otherUserId,
        receiver: myId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Messages marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.log("MARK READ ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const myId = req.user._id;

    const unreadMessages = await Message.aggregate([
      {
        $match: {
          receiver: myId,
          isRead: false,
        },
      },
      {
        $group: {
          _id: "$sender",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: unreadMessages,
    });
  } catch (error) {
    console.log("UNREAD COUNT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "name email profilePicture")
      .sort({ lastMessageAt: -1 });

    res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations,
    });
  } catch (error) {
    console.log("GET CONVERSATIONS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};