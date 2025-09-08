import { useState, useEffect } from "react";

import {API_URL} from '../../lib/API.js'

const Opportunities = () => {
  const token = localStorage.getItem("token_ineco");

  const [opportunities, setOpportunities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "scholarship",
    description: "",
    eligibility: "",
    benefits: "",
    application_deadline: "",
    application_link: "",
    value: "",
    duration: "",
    location: "",
    requirements: [],
    tags: [],
    is_active: true,
  });

  // Fetch all opportunities
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await fetch(
          `${API_URL}admin/getopportunities`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          setOpportunities(data.opportunities);
        }
      } catch (error) {
        console.error("Error fetching opportunities:", error);
      }
    };

    fetchOpportunities();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${API_URL}admin/addopportunity`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (data.success) {
        alert("Opportunity added successfully!");
        setOpportunities((prev) => [...prev, data.opportunity]);
        setShowModal(false);
        setFormData({
          title: "",
          type: "scholarship",
          description: "",
          eligibility: "",
          benefits: "",
          application_deadline: "",
          application_link: "",
          value: "",
          duration: "",
          location: "",
          requirements: [],
          tags: [],
          is_active: true,
        });
      } else {
        alert("Failed to add opportunity: " + data.message);
      }
    } catch (error) {
      console.error("Error adding opportunity:", error);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-blue-500 font-bold">Opportunities</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Add Opportunity
        </button>
      </div>

      {/* Opportunities Table */}
      <table className="w-full bg-slate-800 text-white rounded overflow-hidden">
        <thead className="bg-slate-700">
          <tr>
            <th className="p-2">Title</th>
            <th className="p-2">Type</th>
            <th className="p-2">Deadline</th>
            <th className="p-2">Location</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {opportunities.map((opp) => (
            <tr key={opp.opportunity_id} className="border-b border-slate-700">
              <td className="p-2">{opp.title}</td>
              <td className="p-2">{opp.type}</td>
              <td className="p-2">
                {new Date(opp.application_deadline).toLocaleDateString()}
              </td>
              <td className="p-2">{opp.location}</td>
              <td className="p-2">
                {opp.application_link ? (
                  <a
                    href={opp.application_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
                  >
                    Apply
                  </a>
                ) : (
                  <span className="text-slate-400">N/A</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Opportunity Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-slate-800 p-6 rounded w-2/3 max-w-2xl space-y-4">
            <h3 className="text-xl text-white font-bold">Add New Opportunity</h3>
            <form onSubmit={handleSubmit} className="space-y-2">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full p-2 rounded bg-slate-700 text-white"
                required
              />
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full p-2 rounded bg-slate-700 text-white"
              >
                <option value="scholarship">Scholarship</option>
                <option value="grant">Grant</option>
                <option value="competition">Competition</option>
                <option value="workshop">Workshop</option>
                <option value="training">Training</option>
              </select>
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-2 rounded bg-slate-700 text-white"
                required
              ></textarea>
              <input
                type="date"
                placeholder="Application Deadline"
                value={formData.application_deadline}
                onChange={(e) =>
                  setFormData({ ...formData, application_deadline: e.target.value })
                }
                className="w-full p-2 rounded bg-slate-700 text-white"
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full p-2 rounded bg-slate-700 text-white"
              />
              <input
                type="text"
                placeholder="Application Link"
                value={formData.application_link}
                onChange={(e) =>
                  setFormData({ ...formData, application_link: e.target.value })
                }
                className="w-full p-2 rounded bg-slate-700 text-white"
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Opportunities;
