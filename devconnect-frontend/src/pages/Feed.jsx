import { useEffect, useState } from "react";
import axios from "axios";``

function Feed() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [commentText, setCommentText] = useState({});

  const token = localStorage.getItem("token");

  // FETCH POSTS
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

  // LIKE POST
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

  // ADD COMMENT
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
      alert(err.response?.data?.message || "Failed to add comment");
    }
  };

  const likePost = async (postId) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/posts/like/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("LIKE SUCCESS:", res.data);

      fetchPosts();
    } catch (err) {
      console.log("LIKE ERROR:", err.response?.data);
      alert(err.response?.data?.message || "Failed to like post");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-[#070A12] text-white p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-yellow-400">
          DEVCONNECT LIKE TEST
        </h1>

        <div className="flex gap-5">
          <button
            onClick={() => (window.location.href = "/profile")}
            className="text-cyan-400"
          >
            Profile
          </button>

          <button
            onClick={() => (window.location.href = "/create-profile")}
            className="text-green-400"
          >
            Create Profile
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="text-red-400"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="bg-white/5 p-4 rounded-lg border border-white/10 mb-6">
        <textarea
          value={content}
          placeholder="Share something..."
          className="w-full bg-transparent outline-none resize-none"
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          onClick={createPost}
          className="mt-3 px-4 py-2 bg-cyan-500 text-black rounded"
        >
          Post
        </button>
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <p>No posts yet</p>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className="p-4 bg-white/5 border border-white/10 rounded-lg"
            >
              <p className="mb-3 text-lg">{post.content}</p>

              <button
                onClick={() => likePost(post._id)}
                className="px-3 py-1 bg-pink-500 text-black rounded"
              >
                ❤️ Like
              </button>

              <p className="mt-2 text-white/70">
                Likes: {post.likes?.length || 0}
              </p>

              {/* COMMENTS SECTION */}
              <div className="mt-5 border-t border-white/10 pt-4">
                <h3 className="font-semibold mb-3">Comments</h3>

                {post.comments?.length > 0 ? (
                  <div className="space-y-2 mb-4">
                    {post.comments.map((comment, index) => (
                      <div
                        key={index}
                        className="bg-black/20 p-2 rounded"
                      >
                        <p>{comment.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/40 mb-4">
                    No comments yet
                  </p>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentText[post._id] || ""}
                    onChange={(e) =>
                      setCommentText((prev) => ({
                        ...prev,
                        [post._id]: e.target.value,
                      }))
                    }
                    className="flex-1 p-2 rounded bg-black/30 border border-white/10"
                  />

                  <button
                    onClick={() => addComment(post._id)}
                    className="px-4 py-2 bg-cyan-500 text-black rounded"
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