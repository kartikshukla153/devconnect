import { useEffect, useState } from "react";
import axios from "axios";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [commentText, setCommentText] = useState({});

  const token = localStorage.getItem("token");

  // ==========================
  // FETCH POSTS
  // ==========================
  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPosts(res.data);
    } catch (err) {
      console.log("FETCH POSTS ERROR:", err.response?.data);
    }
  };

  // ==========================
  // CREATE POST
  // ==========================
  const createPost = async () => {
    try {
      if (!content.trim()) {
        alert("Post cannot be empty");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/posts",
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setContent("");
      fetchPosts();
    } catch (err) {
      console.log("CREATE POST ERROR:", err.response?.data);
    }
  };

  // ==========================
  // LIKE POST
  // ==========================
  const likePost = async (postId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/posts/like/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchPosts();
    } catch (err) {
      console.log("LIKE ERROR:", err.response?.data);
      alert(err.response?.data?.message || "Failed to like post");
    }
  };

  // ==========================
  // COMMENT
  // ==========================
  const addComment = async (postId) => {
    try {
      const text = commentText[postId];

      if (!text || !text.trim()) {
        alert("Comment cannot be empty");
        return;
      }

      await axios.post(
        `http://localhost:5000/api/posts/comment/${postId}`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCommentText((prev) => ({
        ...prev,
        [postId]: "",
      }));

      fetchPosts();
    } catch (err) {
      console.log("COMMENT ERROR:", err.response?.data);
      alert(err.response?.data?.message || "Failed to comment");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-[#070A12] text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-yellow-400">
          DevConnect Feed
        </h1>

        <div className="flex gap-4">
          <button
            className="text-cyan-400"
            onClick={() => (window.location.href = "/profile")}
          >
            Profile
          </button>

          <button
            className="text-green-400"
            onClick={() => (window.location.href = "/create-profile")}
          >
            Create Profile
          </button>

          <button
            className="text-red-400"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share something..."
          className="w-full bg-transparent outline-none resize-none"
        />

        <button
          onClick={createPost}
          className="mt-3 px-4 py-2 bg-cyan-500 rounded text-black"
        >
          Post
        </button>
      </div>

      <div className="space-y-5">
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-white/5 border border-white/10 rounded-lg p-4"
            >
              <h3 className="font-semibold mb-2">
                {post.user?.name || "Unknown User"}
              </h3>

              <p>{post.content}</p>

              <button
                onClick={() => likePost(post._id)}
                className="mt-3 px-3 py-1 bg-pink-500 rounded text-black"
              >
                ❤️ Like
              </button>

              <p className="mt-2">
                Likes: {post.likes?.length || 0}
              </p>

              <div className="mt-5 border-t border-white/10 pt-4">
                <h3 className="mb-3 font-semibold">Comments</h3>

                {post.comments?.length > 0 ? (
                  post.comments.map((comment, index) => (
                    <div
                      key={index}
                      className="bg-black/20 p-2 rounded mb-2"
                    >
                      {comment.text}
                    </div>
                  ))
                ) : (
                  <p className="text-white/40">
                    No comments yet
                  </p>
                )}

                <div className="flex gap-2 mt-3">
                  <input
                    className="flex-1 p-2 rounded bg-black/30 border border-white/10"
                    placeholder="Write a comment..."
                    value={commentText[post._id] || ""}
                    onChange={(e) =>
                      setCommentText((prev) => ({
                        ...prev,
                        [post._id]: e.target.value,
                      }))
                    }
                  />

                  <button
                    onClick={() => addComment(post._id)}
                    className="px-4 py-2 bg-cyan-500 rounded text-black"
                  >
                    Comment
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Feed;