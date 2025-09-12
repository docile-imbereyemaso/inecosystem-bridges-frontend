import { useState, useEffect } from 'react';
import { useAuth } from "../../lib/useAuth";
import { API_URL } from "../../lib/API";

const Internships = () => {
  
  const { user } = useAuth();
  const token = typeof window !== "undefined" ? localStorage.getItem("token_ineco") : null;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInternship, setEditingInternship] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    level: '',
    sponsorship: false,
    sector: '',
    period: '',
    applicationOpen: true,
    deadline: ''
  });

  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternships = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token_ineco");
        const response = await fetch("http://localhost:3000/api/internships", {
          method: "GET",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Map backend fields to frontend expected fields
  const mappedInternships = data.internships.map((internship) => ({
          id: internship.internship_id,
          name: internship.name,
          type: internship.type,
          level: internship.level,
          sponsorship: internship.sponsorship,
          sector: internship.sector,
          period: internship.period,
          applicationOpen: internship.application_open,
          deadline: internship.deadline
        }));
        
        setInternships(mappedInternships);
      } catch (err) {
        console.error("Fetch error:", err);
        setInternships([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  const openDialog = (internship) => {
    if (internship) {
      setEditingInternship(internship);
      setFormData({
        name: internship.name,
        type: internship.type,
        level: internship.level,
        sponsorship: internship.sponsorship,
        sector: internship.sector,
        period: internship.period,
        applicationOpen: internship.applicationOpen,
        deadline: internship.deadline
      });
    } else {
      setEditingInternship(null);
      setFormData({
        name: '',
        type: '',
        level: '',
        sponsorship: false,
        sector: '',
        period: '',
        applicationOpen: true,
        deadline: ''
      });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingInternship(null);
  };

  const saveInternship = async () => {
  // Validate required fields
  if (!formData.name || !formData.type || !formData.level || !formData.deadline) {
    alert("Name, type, level, and deadline are required");
    return;
  }

  try {
    const token = localStorage.getItem("token_ineco");
    const url = editingInternship 
      ? `http://localhost:3000/api/internships/${editingInternship.id}` 
      : "http://localhost:3000/api/internships";

    const method = editingInternship ? "PUT" : "POST";

    // Send ONLY the essential fields for now
    const requestData = {
      name: formData.name,
      type: formData.type,
      level: formData.level,
      sponsorship: formData.sponsorship,
      sector: formData.sector,
      period: formData.period,
      application_open: formData.applicationOpen,
      deadline: formData.deadline
      // Omit optional fields for now: description, requirements, benefits, etc.
    };

    console.log("Sending request data:", requestData);

    const response = await fetch(url, {
      method: method,
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(requestData),
    });

    const responseData = await response.json();
    console.log("Response status:", response.status);
    console.log("Response data:", responseData);
    
    if (!response.ok) {
      throw new Error(responseData.message || "Failed to save internship");
    }

    // ... rest of your success handling code
  } catch (error) {
    console.error("Error saving internship:", error);
    alert(error.message || "Failed to save internship");
  }
};


  const deleteInternship = async (id) => {
    if (!confirm("Are you sure you want to delete this internship?")) return;

    try {
      const token = localStorage.getItem("token_ineco");
      const response = await fetch(`http://localhost:3000/api/internships/${id}`, {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        setInternships(prev => prev.filter(internship => internship.id !== id));
        alert("Internship deleted successfully!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete internship");
      }
  } catch (error) {
      console.error("Error deleting internship:", error);
      alert(error.message || "Failed to delete internship");
    }
  };

  const toggleApplicationStatus = async (id) => {
    try {
      const token = localStorage.getItem("token_ineco");
      const internship = internships.find(i => i.id === id);
      
      if (!internship) return;

      const response = await fetch(`http://localhost:3000/api/internships/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          application_open: !internship.applicationOpen
        }),
      });

      if (response.ok) {
        setInternships(prev => prev.map(internship =>
          internship.id === id
            ? { ...internship, applicationOpen: !internship.applicationOpen }
            : internship
        ));
        alert("Application status updated!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update internship");
      }
  } catch (error) {
      console.error("Error toggling application status:", error);
      alert(error.message || "Failed to update internship");
    }
  };

  return (
    <div className="min-h-screen dark:bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-white text-2xl mb-2">Internships</h1>
            <p className="text-slate-400">Manage internship programs and applications</p>
          </div>
          <button 
            onClick={() => openDialog(null)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Internship
          </button>
        </div>

        {/* Internship Cards */}
        <div className="grid gap-4">
          {loading ? (
            <div className="text-white text-center py-8">Loading internships...</div>
          ) : internships.length === 0 ? (
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
              <svg className="w-12 h-12 text-slate-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="text-slate-400 text-lg mb-2">No internships available</h3>
              <p className="text-slate-500 mb-4">Get started by adding your first internship opportunity.</p>
              <button 
                onClick={() => openDialog(null)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Add First Internship
              </button>
            </div>
          ) : (
            internships.map((internship) => (
              <div key={internship.id} className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white text-lg mb-2">{internship.name}</h3>
                    <div className="flex gap-2 mb-3 flex-wrap">
                      <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">{internship.type}</span>
                      <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">{internship.level}</span>
                      <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">{internship.sector}</span>
                      {internship.sponsorship && (
                        <span className="bg-yellow-600 text-white px-2 py-1 rounded text-xs">Sponsored</span>
                      )}
                      <span className={`px-2 py-1 rounded text-xs text-white ${
                        internship.applicationOpen ? "bg-green-600" : "bg-red-600"
                      }`}>
                        {internship.applicationOpen ? "Applications Open" : "Applications Closed"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleApplicationStatus(internship.id)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        internship.applicationOpen 
                          ? 'text-red-400 hover:text-red-300 hover:bg-red-400/10' 
                          : 'text-green-400 hover:text-green-300 hover:bg-green-400/10'
                      }`}
                    >
                      {internship.applicationOpen ? 'Close' : 'Open'}
                    </button>
                    <button
                      onClick={() => openDialog(internship)}
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 p-2 rounded transition-colors"
                      title="Edit Internship"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteInternship(internship.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 rounded transition-colors"
                      title="Delete Internship"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-300">
                  <div>
                    <h4 className="mb-1">Duration</h4>
                    <p className="text-white">{internship.period}</p>
                  </div>
                  <div>
                    <h4 className="mb-1">Deadline</h4>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-white">{new Date(internship.deadline).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-1">Status</h4>
                    <p className={`${
                      new Date(internship.deadline) > new Date() 
                        ? 'text-green-400' 
                        : 'text-red-400'
                    }`}>
                      {new Date(internship.deadline) > new Date() ? 'Active' : 'Expired'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Dialog */}
        {isDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 border border-slate-700 text-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {editingInternship ? 'Edit Internship' : 'Add New Internship'}
                </h2>
                <button
                  onClick={closeDialog}
                  className="text-slate-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Internship Name */}
                <div>
                  <label className="block text-slate-300 mb-1">Internship Name *</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2"
                    placeholder="Enter internship name"
                    required
                  />
                </div>

                {/* Type and Level */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1">Type *</label>
                    <select
                      value={formData.type || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2"
                      required
                    >
                      <option value="">Select type</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="remote">Remote</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Level *</label>
                    <select
                      value={formData.level || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                      className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2"
                      required
                    >
                      <option value="">Select level</option>
                      <option value="entry">Entry Level</option>
                      <option value="junior">Junior</option>
                      <option value="mid">Mid Level</option>
                      <option value="senior">Senior</option>
                    </select>
                  </div>
                </div>

                {/* Sector and Period */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1">Sector *</label>
                    <select
                      value={formData.sector || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, sector: e.target.value }))}
                      className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2"
                      required
                    >
                      <option value="">Select sector</option>
                      <option value="Technology">Technology</option>
                      <option value="Finance">Finance</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Design">Design</option>
                      <option value="Research">Research</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Period *</label>
                    <input
                      type="text"
                      value={formData.period || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value }))}
                      placeholder="e.g., 3 months, 6 months"
                      className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2"
                      required
                    />
                  </div>
                </div>

                {/* Application Deadline */}
                <div>
                  <label className="block text-slate-300 mb-1">Application Deadline *</label>
                  <input
                    type="date"
                    value={formData.deadline || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2"
                    required
                  />
                </div>

                {/* Toggle Switches */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-slate-300 block">Sponsorship Available</label>
                      <p className="text-slate-400 text-sm">Does this internship offer sponsorship?</p>
                    </div>
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, sponsorship: !prev.sponsorship }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.sponsorship ? 'bg-blue-600' : 'bg-slate-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.sponsorship ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-slate-300 block">Applications Open</label>
                      <p className="text-slate-400 text-sm">Are applications currently being accepted?</p>
                    </div>
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, applicationOpen: !prev.applicationOpen }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.applicationOpen ? 'bg-blue-600' : 'bg-slate-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.applicationOpen ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={closeDialog}
                    className="border border-slate-600 text-slate-300 hover:bg-slate-700 px-4 py-2 rounded transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveInternship}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    {editingInternship ? 'Update Internship' : 'Add Internship'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Internships;