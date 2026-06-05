import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/profile/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);

      setProfile(res.data.profile);
    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

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
      <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-xl p-8">

        <h1 className="text-3xl font-bold mb-2">
          {profile.user?.name}
        </h1>

        <p className="text-cyan-400 mb-4">
          @{profile.username}
        </p>

        <h2 className="text-xl mb-3">
          {profile.headline}
        </h2>

        <p className="text-white/70 mb-6">
          {profile.bio}
        </p>

        <div className="mb-6">
          <h3 className="font-semibold mb-3">Skills</h3>

          <div className="flex flex-wrap gap-2">
            {profile.skills?.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Social Links</h3>

          <div className="space-y-2 text-cyan-400">

            {profile.socialLinks?.github && (
              <a
                href={profile.socialLinks.github}
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                GitHub
              </a>
            )}

            {profile.socialLinks?.linkedin && (
              <a
                href={profile.socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                LinkedIn
              </a>
            )}

            {profile.socialLinks?.portfolio && (
              <a
                href={profile.socialLinks.portfolio}
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                Portfolio
              </a>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;