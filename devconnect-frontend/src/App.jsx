import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import CreateProfile from "./pages/CreateProfile";
import AddExperience from "./pages/AddExperience";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>

      {/* DEFAULT ROUTE */}
      <Route
        path="/"
        element={
          token ? <Navigate to="/feed" /> : <Navigate to="/login" />
        }
      />

      {/* AUTH ROUTES */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* FEED */}
      <Route
        path="/feed"
        element={
          token ? <Feed /> : <Navigate to="/login" />
        }
      />

      {/* PROFILE */}
      <Route
        path="/profile"
        element={
          token ? <Profile /> : <Navigate to="/login" />
        }
      />

      {/* CREATE PROFILE */}
      <Route
        path="/create-profile"
        element={
          token ? <CreateProfile /> : <Navigate to="/login" />
        }
      />

      {/* ADD EXPERIENCE */}
      <Route
        path="/add-experience"
        element={
          token ? <AddExperience /> : <Navigate to="/login" />
        }
      />

    </Routes>
  );
}

export default App;