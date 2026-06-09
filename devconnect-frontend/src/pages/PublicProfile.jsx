import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function PublicProfile() {
  const { userId } = useParams();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/profile/${userId}`
      );

      setProfile(res.data.profile);
    } catch (err) {
      console.log(
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070A12] text-white flex items-center justify-center">
        Loading Profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#070A12] text-white flex items-center justify-center">
        Profile Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070A12] text-white p-8">
      <div className="max-w-5xl mx-auto bg-white/5 border border-white/10 rounded-xl p-8">

        <h1 className="text-4xl font-bold mb-2">
          {profile.user?.name}
        </h1>

        <p className="text-cyan-400 text-lg mb-4">
          @{profile.username}
        </p>

        {profile.location && (
          <p className="text-white/60 mb-6">
            📍 {profile.location}
          </p>
        )}

        {profile.headline && (
          <h2 className="text-2xl mb-6">
            {profile.headline}
          </h2>
        )}

        {profile.bio && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">
              About
            </h3>

            <p className="text-white/70">
              {profile.bio}
            </p>
          </div>
        )}

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">
            Skills
          </h3>

          <div className="flex flex-wrap gap-3">
            {profile.skills?.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default PublicProfile;