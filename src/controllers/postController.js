import Post from "../models/Post.js";

/**
 * CREATE POST
 */
export const createPost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Post content is required",
      });
    }

    const post = await Post.create({
      content,
      user: req.user._id,
    });

    const populatedPost = await Post.findById(post._id)
      .populate("user", "name email");

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: populatedPost,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET ALL POSTS
 */
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json(posts);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};