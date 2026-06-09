import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Developers() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skill, setSkill] = useState("");

  const fetchDevelopers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/profile"
      );

      setProfiles(res.data.profiles || []);
    } catch (err) {
      console.log(
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const searchDevelopers = async () => {
    if (!skill.trim()) {
      fetchDevelopers();
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:5000/api/profile/search/skills?skill=${skill}`
      );

      setProfiles(res.data.profiles || []);
    } catch (err) {
      console.log(
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSkill("");
    fetchDevelopers();
  };

  useEffect(() => {
    fetchDevelopers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070A12] text-white flex items-center justify-center">
        Loading Developers...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070A12] text-white p-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Discover Developers
        </h1>

        {/* SEARCH */}
        <div className="flex flex-col md:flex-row gap-3 mb-8">

          <input
            type="text"
            placeholder="Search by skill..."
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="flex-1 p-3 bg-white/5 border border-white/10 rounded-lg"
          />

          <button
            onClick={searchDevelopers}
            className="px-5 py-3 bg-cyan-500 text-black rounded-lg font-semibold"
          >
            Search
          </button>

          <button
            onClick={clearSearch}
            className="px-5 py-3 bg-white/10 rounded-lg"
          >
            Clear
          </button>

        </div>

        {profiles.length === 0 ? (
          <div className="text-white/50">
            No developers found.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {profiles.map((profile) => (
              <div
                key={profile._id}
                className="bg-white/5 border border-white/10 rounded-xl p-6"
              >
                <h2 className="text-2xl font-semibold mb-2">
                  {profile.user?.name}
                </h2>

                <p className="text-cyan-400 mb-3">
                  @{profile.username}
                </p>

                <p className="text-white/80 mb-3">
                  {profile.headline}
                </p>

                {profile.location && (
                  <p className="text-white/50 mb-4">
                    📍 {profile.location}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mb-5">
                  {profile.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm bg-cyan-500/20 border border-cyan-500/30 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <Link
                  to={`/developers/${profile.user._id}`}
                  className="inline-block px-4 py-2 bg-cyan-500 text-black rounded-lg font-semibold"
                >
                  View Profile
                </Link>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default Developers;