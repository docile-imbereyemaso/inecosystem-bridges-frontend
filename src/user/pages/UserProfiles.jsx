import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { use, useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import { useAuth } from "../../lib/useAuth.js";
import { API_URL } from "../../lib/API.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  // Skills removed
  const [selectedSectors, setSelectedSectors] = useState([]);
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
        console.log(data.user["first_name"]);
        setProfile({
          firstName: data.user["first_name"] || "",
          lastName: data.user["last_name"] || "",
          email: data.user["email"] || "",
          phone: data.user["phone"] || "",
          bio: data.user["bio"] || "",
        });
  // Skills removed
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
  // skills removed
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

      if (!res.ok) throw new Error("Failed to update profile");

      console.log("Updated profile:", updatedData); // ✅ Log updated data
  toast.success("Profile updated successfully!", { position: "top-right", autoClose: 3000 });
    } catch (error) {
      console.error("Error updating profile:", error);
  toast.error("Error updating profile.", { position: "top-right", autoClose: 3000 });
    }
  };

  // Skills functions removed

  const handleSectorToggle = (sector) => {
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

      <div className="rounded-2xl border border-gray-300 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
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
                  value={user["first_name"] || profile.firstName}
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
                  value={user["last_name"] || profile.lastName}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, lastName: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded dark:bg-gray-800"
                />
              </div>

              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Email:{user["email"] || profile.email}
                </p>
                <input
                  type="email"
                  value={user["email"] || profile.email}
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
                  value={user["phone"] || profile.phone}
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
                  value={user["bio"] || profile.bio}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded dark:bg-gray-800"
                />
              </div>
            </div>
          </div>

          {/* Skills section removed */}

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
          <ToastContainer className={'z-40'}/>
        </div>
      </div>
    </>
  );
}
