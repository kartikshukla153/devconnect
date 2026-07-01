import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { connectSocket } from "../socket/socket";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const loginUser = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      console.log("LOGIN RESPONSE:", res.data);

      // Save JWT
      localStorage.setItem("token", res.data.token);

      // Save logged-in user
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      // Connect socket
      connectSocket(res.data.user._id);

      // Go to Feed
      navigate("/feed");
    } catch (err) {
      console.log("LOGIN ERROR:", err.response?.data);

      alert(
        err.response?.data?.message ||
          "Login failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070A12] text-white">
      <div className="w-full max-w-md p-6 bg-white/5 border border-white/10 rounded-xl">
        <h1 className="text-xl font-semibold mb-6">
          Login
        </h1>

        <input
          value={email}
          placeholder="Email"
          className="w-full mb-3 p-3 bg-black/30 border border-white/10 rounded"
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          value={password}
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 bg-black/30 border border-white/10 rounded"
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          onClick={loginUser}
          className="w-full py-3 bg-cyan-500 text-black rounded hover:opacity-90"
        >
          Login
        </button>

        <p
          onClick={() => navigate("/register")}
          className="text-xs text-center mt-4 text-white/50 cursor-pointer hover:text-white"
        >
          Don't have an account? Register
        </p>
      </div>
    </div>
  );
}

export default Login;