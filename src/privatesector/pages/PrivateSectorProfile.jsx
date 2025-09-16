import { useState, useEffect, useRef } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { useAuth } from "../../lib/useAuth";
import { API_URL } from "../../lib/API";

export default function PrivateSectorProfiles() {
  const { user } = useAuth();
  const token = typeof window !== "undefined" ? localStorage.getItem("token_ineco") : null;

  // Company profile state
  const [companyData, setCompanyData] = useState({
    id: null,
    company_name: "",
    bio: "",
    email: "",
    phone: "",
    sectors: [],
    description: "",
    locations: [],
    contacts: [],
    offerings: [],
    internships: [],
    user_id: "",
  });

  // UI states
  const [newLocation, setNewLocation] = useState("");
  const [newContact, setNewContact] = useState({ type: "", value: "" });
  const [newOffering, setNewOffering] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  // Utility: ensure array
  const asArray = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      if (typeof val === "string") {
        return val.split(",").map((s) => s.trim()).filter(Boolean);
      }
      return [];
    }
  };

  // Utility: dedupe array push
  const dedupePush = (arr, item, keyFn = (x) => (typeof x === "string" ? x.toLowerCase() : JSON.stringify(x).toLowerCase())) => {
    const exists = arr.some((x) => keyFn(x) === keyFn(item));
    return exists ? arr : [...arr, item];
  };

  // Fetch profile info
  const fetchProfile = async () => {
    if (!user?.user_id || !token) return;
    try {
      const userRes = await fetch(`${API_URL}users/profile/${user.user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const rawUser = await userRes.json();
      const userInfo = rawUser?.user ?? rawUser ?? {};
      const companyInfo = userInfo.companies && userInfo.companies[0] ? userInfo.companies[0] : {};

      setCompanyData({
        ...userInfo,
        contacts: companyInfo.contacts || [],
        name: companyInfo.name,
        description: companyInfo.description,
        locations: companyInfo.locations || [],
        offerings: companyInfo.offerings || [],
      });

      if (userInfo.profile_image) setProfileImage(userInfo.profile_image);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.user_id, token]);

  // Save company info
  const saveCompany = async () => {
    if (!user?.user_id || !token) return;
    setLoading(true);
    try {
      // Update USER table
      const userUpdate = await fetch(`${API_URL}companies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          company_name: companyData.company_name,
          bio: companyData.bio,
          email: companyData.email,
          phone: companyData.phone,
          sectors: companyData.sectors,
        }),
      });
      if (!userUpdate.ok) throw new Error(`User update failed: ${await userUpdate.text()}`);

      // Update COMPANY table
      const url = companyData.id
        ? `${API_URL}/companies/${companyData.id}`
        : `${API_URL}/companies`;
      const companyPayload = {
        name: companyData.company_name,
        description: companyData.bio,
        locations: companyData.locations,
        contacts: companyData.contacts,
        offerings: companyData.offerings,
        internships: companyData.internships,
        user_id: user.user_id,
      };
      const compRes = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(companyPayload),
      });
      if (!compRes.ok) throw new Error(`Company save failed: ${await compRes.text()}`);

      await fetchProfile();
      alert("Profile saved successfully!");
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving profile");
    } finally {
      setLoading(false);
    }
  };

  // Upload profile image
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_URL}companies/upload-profile-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setProfileImage(data.url);
        alert("Profile image uploaded!");
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      alert("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  // Add/remove handlers
  const addLocation = () => {
    const val = newLocation.trim();
    if (!val) return;
    setCompanyData((prev) => ({
      ...prev,
      locations: dedupePush(prev.locations, val, (x) => x.toLowerCase()),
    }));
    setNewLocation("");
  };
  const removeLocation = (index) => {
    setCompanyData((prev) => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index),
    }));
  };
  const addOffering = () => {
    const val = newOffering.trim();
    if (!val) return;
    setCompanyData((prev) => ({
      ...prev,
      offerings: dedupePush(prev.offerings, val, (x) => x.toLowerCase()),
    }));
    setNewOffering("");
  };
  const removeOffering = (index) => {
    setCompanyData((prev) => ({
      ...prev,
      offerings: prev.offerings.filter((_, i) => i !== index),
    }));
  };
  const addContact = () => {
    if (!newContact.type.trim() || !newContact.value.trim()) return;
    setCompanyData((prev) => ({
      ...prev,
      contacts: dedupePush(prev.contacts, { ...newContact }, (x) => `${x.type}:${x.value}`.toLowerCase()),
    }));
    setNewContact({ type: "", value: "" });
  };
  const removeContact = (index) => {
    setCompanyData((prev) => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index),
    }));
  };

  return (
    <>
      <PageMeta title="INECOSYSTEM BRIDGES" description="" />
      <PageBreadcrumb pageTitle="Profile" />

      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-2">
            Company Profile
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your company information and details
          </p>
        </header>

        {/* Profile Picture Upload */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] mb-4 flex items-center gap-6">
          <div>
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 dark:text-gray-600 text-4xl">+</span>
              )}
            </div>
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <button
              type="button"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={() => fileInputRef.current.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : profileImage ? "Change Profile Picture" : "Upload Profile Picture"}
            </button>
            <p className="text-xs text-gray-500 mt-2">Recommended size: 400x400px</p>
          </div>
        </section>

        <form className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Basic Information */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white/90">
              Basic Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyData.company_name}
                  onChange={(e) =>
                    setCompanyData((prev) => ({ ...prev, company_name: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Company Description (Bio)
                </label>
                <textarea
                  value={companyData.bio}
                  onChange={(e) =>
                    setCompanyData((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  rows={3}
                  placeholder="Describe your company..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                />
              </div>
            </div>
          </section>

          {/* Locations */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white/90">Locations</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                {companyData.locations.map((location, index) => (
                  <div
                    key={`${location}-${index}`}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <span className="text-sm text-gray-800 dark:text-white/90 break-words">{location}</span>
                    <button
                      type="button"
                      onClick={() => removeLocation(index)}
                      className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 self-end sm:self-center"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Add new location..."
                  onKeyPress={(e) => e.key === "Enter" && addLocation()}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                />
                <button
                  type="button"
                  onClick={addLocation}
                  className="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 sm:w-auto w-full"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>

          {/* Contacts */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white/90">Contact Information</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                {companyData.contacts.map((contact, index) => (
                  <div
                    key={`${contact.type}-${contact.value}-${index}`}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="inline-block rounded bg-gray-200 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300 mb-1">
                        {contact.type}
                      </span>
                      <p className="text-sm text-gray-800 dark:text-white/90 break-words">{contact.value}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeContact(index)}
                      className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 self-end sm:self-center"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
                <input
                  type="text"
                  value={newContact.type}
                  onChange={(e) => setNewContact((prev) => ({ ...prev, type: e.target.value }))}
                  placeholder="Contact type (Email, Phone, etc.)"
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                />
                <input
                  type="text"
                  value={newContact.value}
                  onChange={(e) => setNewContact((prev) => ({ ...prev, value: e.target.value }))}
                  placeholder="Contact value"
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                />
                <button
                  type="button"
                  onClick={addContact}
                  className="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 sm:w-auto w-full"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>

          {/* What We Offer */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white/90">What We Offer</h3>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {companyData.offerings.map((offering, index) => (
                  <span
                    key={`${offering}-${index}`}
                    className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-sm text-white"
                  >
                    {offering}
                    <button
                      type="button"
                      onClick={() => removeOffering(index)}
                      className="ml-1 text-white hover:text-blue-200"
                    >
                      <FiTrash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newOffering}
                  onChange={(e) => setNewOffering(e.target.value)}
                  placeholder="Add new offering..."
                  onKeyPress={(e) => e.key === "Enter" && addOffering()}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                />
                <button
                  type="button"
                  onClick={addOffering}
                  className="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>
        </form>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            onClick={fetchProfile}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={saveCompany}
            className={`rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </>
  );
}
