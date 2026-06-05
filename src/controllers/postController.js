export const createPost = async (req, res) => {
  res.status(200).json({
    message: "Create Post Working",
  });
};

export const getPosts = async (req, res) => {
  res.status(200).json({
    message: "Get Posts Working",
  });
};