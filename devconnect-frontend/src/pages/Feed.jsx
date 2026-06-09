import { useEffect, useState } from "react";
import axios from "axios";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");

  const token = localStorage.getItem("token");

  // GET POSTS
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

  // CREATE POST
  const createPost = async () => {
    try {
      if (!content.trim()) {
        alert("Post cannot be empty");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/posts",
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("POST CREATED:", res.data);

      setContent("");
      fetchPosts();
    } catch (err) {
      console.log("CREATE POST ERROR:", err.response?.data);
      alert(err.response?.data?.message || "Post failed");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-[#070A12] text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">DevConnect</h1>

        <div className="flex items-center gap-5">

          <button
            onClick={() => {
              window.location.href = "/profile";
            }}
            className="text-cyan-400 hover:text-cyan-300"
          >
            Profile
          </button>

          <button
            onClick={() => {
              window.location.href = "/create-profile";
            }}
            className="text-green-400 hover:text-green-300"
          >
            Create Profile
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="text-red-400 hover:text-red-300"
          >
            Logout
          </button>

        </div>
      </div>

      {/* CREATE POST */}
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

      {/* POSTS */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-white/40">No posts yet</p>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className="p-4 bg-white/5 border border-white/10 rounded-lg"
            >
              <p className="mb-2">{post.content}</p>

              <div className="text-xs text-white/40">
                ❤️ {post.likes?.length || 0} likes
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default Feed;
