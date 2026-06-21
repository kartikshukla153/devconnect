import Notification from "../models/Notification.js";

const createNotification = async ({
  recipient,
  sender,
  type,
  message,
  relatedPost = null,
  relatedProject = null,
}) => {
  try {
    console.log("========== NOTIFICATION DEBUG ==========");
    console.log("recipient:", recipient);
    console.log("sender:", sender);
    console.log("type:", type);
    console.log("message:", message);

    const notification = await Notification.create({
      recipient,
      sender,
      type,
      message,
      relatedPost,
      relatedProject,
    });

    console.log(
      "Notification Created Successfully:",
      notification._id
    );

    console.log("========================================");
  } catch (error) {
    console.log(
      "Notification Creation Error:",
      error.message
    );
  }
};

export default createNotification;