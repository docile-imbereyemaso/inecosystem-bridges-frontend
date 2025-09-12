import { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiExternalLink } from "react-icons/fi";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { useAuth } from "../../lib/useAuth";
import { API_URL } from "../../lib/API";

// ...existing code...

// ENUM values from your database schema
const JOB_TYPES = ['full-time', 'part-time', 'contract', 'freelance', 'internship'];
const JOB_LEVELS = ['entry', 'junior', 'mid', 'senior', 'executive'];

export default function JobBoard() {
  const { user } = useAuth();
  const token = typeof window !== "undefined" ? localStorage.getItem("token_ineco") : null;

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    skills_required: [],
    qualifications: [],
    level: "",
    application_link: "",
    period: "",
    positions: 1,
  });

  const [newSkill, setNewSkill] = useState("");
  const [newQualification, setNewQualification] = useState("");

  // ---------- Fetch Jobs ----------
  const fetchJobs = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}jobs/company/my-jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Fetch jobs failed: ${res.status}`);
      const data = await res.json();
      setJobs(data.jobs);
    } catch (err) {
      console.error("Fetch jobs error:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [user?.user_id, token]);

  // ---------- Utilities ----------
  const dedupePush = (arr, item, keyFn = (x) => x.toString().toLowerCase()) => {
    const exists = arr.some((x) => keyFn(x) === keyFn(item));
    return exists ? arr : [...arr, item];
  };

  const openDialog = (job = null) => {
    if (job) {
      setEditingJob(job);
      setFormData({ 
        name: job.name,
        type: job.type,
        skills_required: job.skills_required,
        qualifications: job.qualifications,
        level: job.level,
        application_link: job.application_link,
        period: job.period,
        positions: job.positions
      });
    } else {
      setEditingJob(null);
      setFormData({
        name: "",
        type: "",
        skills_required: [],
        qualifications: [],
        level: "",
        application_link: "",
        period: "",
        positions: 1,
      });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingJob(null);
    setNewSkill("");
    setNewQualification("");
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills_required: dedupePush(prev.skills_required, newSkill.trim()),
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      skills_required: prev.skills_required.filter((_, i) => i !== index),
    }));
  };

  const addQualification = () => {
    if (newQualification.trim()) {
      setFormData((prev) => ({
        ...prev,
        qualifications: dedupePush(prev.qualifications, newQualification.trim()),
      }));
      setNewQualification("");
    }
  };

  const removeQualification = (index) => {
    setFormData((prev) => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index),
    }));
  };

  // ---------- Save Job ----------
  const saveJob = async () => {
    if (!token) return;
    try {
      const url = editingJob ? `${API_URL}jobs/${editingJob.job_id}` : `${API_URL}jobs`;
      const method = editingJob ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(`Job save failed: ${msg}`);
      }

      const response = await res.json();
      const savedJob = response.job || response;

      setJobs((prev) =>
        editingJob ? prev.map((job) => (job.job_id === savedJob.job_id ? savedJob : job)) : [...prev, savedJob]
      );

      closeDialog();
    } catch (err) {
      console.error("Save job error:", err);
      alert("Error saving job");
    }
  };

  // ---------- Delete Job ----------
  const deleteJob = async (id) => {
    if (!token) {
      alert("You need to be logged in to delete a job");
      return;
    }
    
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      console.log("Sending delete request for job:", id);
      
      const res = await fetch(`${API_URL}jobs/${id}`, {
        method: "DELETE",
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      console.log("Response status:", res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server error response:", errorText);
        throw new Error(`Server returned ${res.status}: ${errorText}`);
      }

      const result = await res.json();
      console.log("Server response:", result);
      
      if (result.success) {
        setJobs((prev) => prev.filter((job) => job.job_id !== id));
        alert("Job deleted successfully");
      } else {
        throw new Error(result.message || "Failed to delete job");
      }
    } catch (err) {
      console.error("Delete job error:", err);
      alert("Error deleting job: " + err.message);
    }
  };

  return (
    <>
      <PageMeta title="Job Board" description="" />
      <PageBreadcrumb pageTitle="Job Board" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-2">Job Board</h1>
          <button
            onClick={() => openDialog(null)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 flex items-center gap-2"
          >
            <FiPlus className="w-4 h-4" />
            Add Job
          </button>
        </div>

        <div className="grid gap-4">
          {loading ? (
            <div>Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div>No jobs found.</div>
          ) : (
            jobs.map((job) => (
              <div key={job.job_id} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">{job.name}</h3>
                    <div className="flex gap-2 mt-2">
                      <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">{job.type}</span>
                      <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">{job.level}</span>
                      <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs">
                        {job.positions} position{job.positions > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {job.company_id === user?.user_id && (
                      <>
                        <button
                          onClick={() => openDialog(job)}
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 p-2 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteJob(job.job_id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 rounded"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => window.open(job.application_link, "_blank")}
                      className="text-green-400 hover:text-green-300 hover:bg-green-400/10 p-2 rounded"
                    >
                      <FiExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <h4 className="text-gray-600 dark:text-gray-400 mb-1">Skills Required</h4>
                    <div className="flex flex-wrap gap-1">
                      {job.skills_required.map((skill, i) => (
                        <span key={i} className="border border-gray-300 px-2 py-1 rounded text-xs text-gray-700 dark:text-gray-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-600 dark:text-gray-400 mb-1">Qualifications</h4>
                    <ul className="text-gray-700 dark:text-gray-300 text-sm space-y-1">
                      {job.qualifications.map((q, i) => (
                        <li key={i}>• {q}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-600 dark:text-gray-400 mb-1">Period</h4>
                    <p className="text-gray-800 dark:text-white/90">{job.period}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ---------- Modal ---------- */}
        {isDialogOpen && (
          <div className="fixed absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center mt-12 p-4 z-50">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl w-full max-w-lg space-y-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                {editingJob ? "Edit Job" : "Add Job"}
              </h3>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Job Name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                />
                
                {/* Job Type Dropdown */}
                <div>
                  <label className="text-gray-600 dark:text-gray-400 text-sm">Job Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                  >
                    <option value="">Select Job Type</option>
                    {JOB_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Job Level Dropdown */}
                <div>
                  <label className="text-gray-600 dark:text-gray-400 text-sm">Job Level</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData((prev) => ({ ...prev, level: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                  >
                    <option value="">Select Job Level</option>
                    {JOB_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  type="text"
                  placeholder="Application Link"
                  value={formData.application_link}
                  onChange={(e) => setFormData((prev) => ({ ...prev, application_link: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                />
                <input
                  type="text"
                  placeholder="Period (e.g., 3 months, Permanent)"
                  value={formData.period}
                  onChange={(e) => setFormData((prev) => ({ ...prev, period: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                />
                <input
                  type="number"
                  placeholder="Positions"
                  value={formData.positions}
                  onChange={(e) => setFormData((prev) => ({ ...prev, positions: Number(e.target.value) }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                />

                {/* Skills */}
                <div>
                  <label className="text-gray-600 dark:text-gray-400 text-sm">Skills Required</label>
                  <div className="flex gap-2 mt-1 mb-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addSkill()}
                      placeholder="Add a skill and press Enter or click +"
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                    />
                    <button 
                      onClick={addSkill} 
                      className="bg-blue-600 px-3 py-2 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FiPlus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {formData.skills_required.map((skill, i) => (
                      <span key={i} className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs flex items-center gap-1">
                        {skill}
                        <button 
                          onClick={() => removeSkill(i)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiTrash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Qualifications */}
                <div>
                  <label className="text-gray-600 dark:text-gray-400 text-sm">Qualifications</label>
                  <div className="flex gap-2 mt-0 lg:mt-1 mb-4">
                    <input
                      type="text"
                      value={newQualification}
                      onChange={(e) => setNewQualification(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addQualification()}
                      placeholder="Add a qualification and press Enter or click +"
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
                    />
                    <button 
                      onClick={addQualification} 
                      className="bg-blue-600 px-3 py-2 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FiPlus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {formData.qualifications.map((q, i) => (
                      <span key={i} className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs flex items-center gap-1">
                        {q}
                        <button 
                          onClick={() => removeQualification(i)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiTrash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={closeDialog}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveJob}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    Save Job
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}