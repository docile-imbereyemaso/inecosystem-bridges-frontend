import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { useEffect, useState } from "react";
import { FaSave, FaEye, FaDownload, FaExternalLinkAlt, FaFilePdf } from "react-icons/fa";
import { useAuth } from "../../lib/useAuth.js";
import { API_URL } from "../../lib/API.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// PDF Viewer Component
const PDFViewer = ({ url, title, className = "" }) => {
  const [pdfError, setPdfError] = useState(false);
  const [loading, setLoading] = useState(true);

  const getPdfUrl = (originalUrl) => {
    if (!originalUrl) return null;

    if (originalUrl.includes("cloudinary.com")) {
      if (!originalUrl.includes(".pdf")) {
        return originalUrl + ".pdf";
      }
      return originalUrl.replace("/upload/", "/raw/upload/");
    }

    return originalUrl;
  };

  const pdfUrl = getPdfUrl(url);

  const handleIframeLoad = () => setLoading(false);
  const handleIframeError = () => {
    setLoading(false);
    setPdfError(true);
  };

  if (!pdfUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
        <FaFilePdf className="text-4xl text-gray-400 mb-2" />
        <span className="text-gray-500 dark:text-gray-400">No {title.toLowerCase()} uploaded</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg border">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <span className="text-sm text-gray-500">Loading PDF...</span>
          </div>
        </div>
      )}

      {!pdfError ? (
        <>
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
            title={title}
            width="100%"
            height="400px"
            className="border rounded-lg"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            style={{ display: loading ? "none" : "block" }}
          />

          {!loading && (
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline text-sm transition-colors"
              >
                <FaExternalLinkAlt className="text-xs" />
                Open in new tab
              </a>
              <a
                href={pdfUrl}
                download
                className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 hover:underline text-sm transition-colors"
              >
                <FaDownload className="text-xs" />
                Download PDF
              </a>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-800 hover:underline text-sm transition-colors"
              >
                <FaEye className="text-xs" />
                Print
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <FaFilePdf className="text-4xl text-red-400 mb-2" />
          <span className="text-red-600 dark:text-red-400 text-sm mb-2">Failed to load PDF</span>
          <div className="flex gap-2">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline text-sm"
            >
              <FaExternalLinkAlt className="text-xs" />
              Try opening directly
            </a>
            <button
              onClick={() => {
                setPdfError(false);
                setLoading(true);
              }}
              className="text-gray-600 hover:text-gray-800 hover:underline text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function UserProfiles() {
  const token = localStorage.getItem("token_ineco");
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    user_type: "",
    profile_image: null,
    resume: "",
    official_document: "",
    status: "",
    tvet_institution: "",
    position: "",
    createdAt: "",
    updatedAt: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}users/profile/${user.user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();

        setProfile({
          firstName: data?.first_name || "",
          lastName: data?.last_name || "",
          email: data?.email || "",
          phone: data?.phone || "",
          bio: data?.bio || "",
          user_type: data?.user_type || "",
          profile_image: data?.profile_image || null,
          resume: data?.resume || "",
          official_document: data?.official_document || "",
          status: data?.status || "",
          tvet_institution: data?.tvet_institution || "",
          position: data?.position || "",
          createdAt: data?.createdAt || "",
          updatedAt: data?.updatedAt || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data", { position: "top-right", autoClose: 3000 });
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProfile();
  }, [user, token]);

  const saveProfile = async () => {
    setSaving(true);
    try {
      const updatedData = { ...profile };
      const res = await fetch(`${API_URL}users/profile/${user.user_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      toast.success("Profile updated successfully!", { position: "top-right", autoClose: 3000 });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile.", { position: "top-right", autoClose: 3000 });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta title="INECOSYSTEM BRIDGES" description="" />
      <PageBreadcrumb pageTitle="Profile" />

      <div className="rounded-2xl border border-gray-300 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
          <div className="flex-shrink-0">
            {profile.profile_image ? (
              <img
                src={profile.profile_image}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-blue-500 shadow-lg">
                {profile.firstName?.[0]}
                {profile.lastName?.[0]}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-lg text-blue-600 dark:text-blue-400 mb-1">
              {profile.status?.replace("-", " ") || "Professional"}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{profile.email}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{profile.phone}</p>
            {profile.bio && <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">{profile.bio}</p>}
            {profile.tvet_institution && (
              <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">TVET Institution: {profile.tvet_institution}</p>
            )}
            {profile.position && (
              <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">Position: {profile.position}</p>
            )}
            <p className="text-xs text-gray-400">
              Joined: {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : ""}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4 flex items-center gap-2">
              <FaFilePdf className="text-red-500" />
              Resume
            </h4>
            {profile.resume ? (
              <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View Resume</a>
            ) : (
              <span className="text-gray-400">No resume uploaded</span>
            )}
          </div>

          <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4 flex items-center gap-2">
              <FaFilePdf className="text-blue-500" />
              Official Document
            </h4>
            {profile.official_document ? (
              <a href={profile.official_document} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View Document</a>
            ) : (
              <span className="text-gray-400">No document uploaded</span>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={saveProfile}
            className={`flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors ${
              saving ? "opacity-60 cursor-not-allowed" : "shadow-md hover:shadow-lg"
            }`}
            disabled={saving}
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Saving...
              </>
            ) : (
              <>
                <FaSave />
                Save Changes
              </>
            )}
          </button>
        </div>

        <ToastContainer className="z-50" />
      </div>
    </>
  );
}
