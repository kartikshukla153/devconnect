import Post from "../models/Post.js";

/**
 * CREATE POST
 */
export const createPost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const post = await Post.create({
      user: req.user.userId,
      content,
    });

    res.status(201).json({
      message: "Post created successfully",
      post,
    });

  } catch (error) {
    console.error("CREATE POST ERROR:", error);
    res.status(500).json({
      message: "Error creating post",
      error: error.message,
    });
  }
};

/**
 * GET POSTS (FEED)
 */
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name email")
      .populate("comments.user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);

  } catch (error) {
    console.error("GET POSTS ERROR:", error);
    res.status(500).json({
      message: "Error fetching posts",
      error: error.message,
    });
  }
};