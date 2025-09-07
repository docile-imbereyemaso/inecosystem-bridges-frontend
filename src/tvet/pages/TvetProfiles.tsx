import { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import {useAuth} from '../../lib/useAuth'
import {API_URL} from '../../lib/API.js'

interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  bio: string;
  password?: string;
}

export default function TvetProfiles() {

  const token = localStorage.getItem("token_ineco"); // Replace with stored token (from login)
const {user} =useAuth()

  const [profile, setProfile] = useState<UserProfile>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    bio: "",
   
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch user profile from backend and autofill inputs
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}users/profile/${user.user_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
console.log(res)
        setProfile({
          first_name:data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          phone: data.phone || "",
          bio: data.bio || "",
        
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

  if(user){
      fetchProfile();
  }
  }, [user, token]);

  // Save updated profile
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}users/profile/${user.user_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-center">Loading profile...</p>;
  }

  return (
    <>
      <PageMeta title="INECOSYSTEM BRIDGES" description="" />
      <PageBreadcrumb pageTitle="TVET Profile" />

      <div className="rounded-2xl border border-gray-400 bg-gray-800 p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          TVET Profile
        </h3>

        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Info */}
            <div className="bg-gray-700 dark:bg-slate-800 p-4 rounded-lg space-y-4 border border-gray-200 dark:border-slate-700">
              <h3 className="text-xl font-semibold">Personal Information</h3>

              <input
                placeholder="First Name"
                value={profile.first_name}
                onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                className="w-full p-2 border rounded"
              />

              <input
                placeholder="Last Name"
                value={profile.last_name}
                onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                className="w-full p-2 border rounded"
              />

              <input
                type="email"
                placeholder="Email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full p-2 border rounded"
              />

              <input
                type="tel"
                placeholder="Phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full p-2 border rounded"
              />

              <textarea
                placeholder="Bio"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Security */}
           
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button
              className="border border-gray-300 px-4 py-2 rounded"
              onClick={() => window.location.reload()}
            >
              Cancel
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
