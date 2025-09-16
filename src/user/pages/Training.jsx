import { useState, useEffect } from "react";
import { API_URL } from "../../lib/API.js";

const Training = () => {
  const token = localStorage.getItem("token_ineco");
  const [opportunities, setOpportunities] = useState([]);

  // Fetch all opportunities
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await fetch(`${API_URL}admin/getopportunities`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) {
          setOpportunities(data.opportunities);
        }
      } catch (error) {
        console.error("Error fetching opportunities:", error);
      }
    };

    fetchOpportunities();
  }, [token]);

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-blue-500 font-bold">Opportunities</h2>
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
    </div>
  );
};

export default Training;
