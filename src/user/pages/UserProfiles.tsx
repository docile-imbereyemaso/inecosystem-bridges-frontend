import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { useEffect, useState } from "react";
import { FaTimes, FaPlus, FaSave } from "react-icons/fa";
import { useAuth } from "../../lib/useAuth.js";
import { API_URL } from "../../lib/API.js";

const sectors = [
  "Technology", "Healthcare", "Education", "Construction", "Manufacturing",
  "Finance", "Retail", "Tourism", "Agriculture", "Energy",
];

const skillOptions = [
  "React","JavaScript","Python","Java","C++","SQL","HTML/CSS","Node.js",
  "TypeScript","PHP","Ruby","Swift","Kotlin","Go","Project Management",
  "Data Analysis","Digital Marketing","Graphic Design","Nursing","Teaching",
  "Accounting","Sales","Customer Service",
];

export default function UserProfiles() {
  const token=localStorage.getItem("token_ineco")
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
  });

  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch profile data from API
  useEffect(() => {
    
    
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}users/profile/${user.user_id}`,{
          headers:{
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        console.log(data.user)
        setProfile({
          firstName: data.user.first_name || "",
          lastName: data.user.last_name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          bio: data.user.bio || "",
        });
        setSkills(data.user.skills || []);
        setSelectedSectors(data.user.sectors || []);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
if(user){
fetchProfile();
}
    
  }, [user,token]);

  // Save updated profile
  const saveProfile = async () => {
    try {
      const updatedData = {
        ...profile,
        skills,
        sectors: selectedSectors,
      };
      const token = localStorage.getItem("token_ineco")

      const res = await fetch(`${API_URL}users/profile/${user.user_id}`,{
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "authorization":`Bearer ${token}`
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error("Failed to update Profile");

      console.log("Updated profile:", updatedData); // ✅ Log updated data
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile.");
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills((prev) => [...prev, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((skill) => skill !== skillToRemove));
  };

  const handleSectorToggle = (sector: string) => {
    setSelectedSectors((prev) =>
      prev.includes(sector)
        ? prev.filter((s) => s !== sector)
        : [...prev, sector]
    );
  };

  if (loading) {
    return <p className="text-center py-10">Loading profile...</p>;
  }

  return (
    <>
      <PageMeta title="INECOSYSTEM BRIDGES" description="" />
      <PageBreadcrumb pageTitle="Profile" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>

        <div className="space-y-6">
          {/* Personal Information */}
          <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
              Personal Information
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  First Name
                </p>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, firstName: e.target.value }))
                  }
                  className="w-full px-3 py-2 border
                   rounded dark:bg-gray-800"
                />
              </div>

              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Last Name
                </p>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, lastName: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded dark:bg-gray-800"
                />
              </div>

              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Email:{profile.email}
                </p>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded dark:bg-gray-800"
                />
              </div>

              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Phone
                </p>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded dark:bg-gray-800"
                />
              </div>

              <div className="lg:col-span-2">
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Bio
                </p>
                <textarea
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded dark:bg-gray-800"
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
              Skills
            </h4>

            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 flex items-center space-x-2 rounded"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-2 hover:bg-blue-300 dark:hover:bg-blue-700 rounded-full p-1"
                    aria-label="Remove skill"
                  >
                    <FaTimes className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex space-x-2 max-w-md">
              <select
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 px-3 py-2 rounded"
              >
                <option value="">Add a skill...</option>
                {skillOptions
                  .filter((skill) => !skills.includes(skill))
                  .map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
              </select>
              <button
                onClick={addSkill}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded flex items-center"
              >
                <FaPlus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Interested Sectors */}
          <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
              Interested Sectors
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {sectors.map((sector) => (
                <button
                  key={sector}
                  onClick={() => handleSectorToggle(sector)}
                  className={`text-sm px-3 py-2 rounded border ${
                    selectedSectors.includes(sector)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`}
                >
                  {sector}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={saveProfile}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded"
          >
            <FaSave /> Save Changes
          </button>
        </div>
      </div>
    </>
  );
}
