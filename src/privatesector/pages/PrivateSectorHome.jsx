import React, { useEffect, useState } from "react";
import {API_URL} from "../../lib/API"
const PrivateSectorHome = () => {
  const [insightsCount, setInsightsCount] = useState(null);
  const [jobsCount, setJobsCount] = useState(null);
  const [contributionsCount, setContributionsCount] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCounts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/stats/private-sector`, {
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${localStorage.getItem("token")}`
        },
        credentials: "include", 
      });
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();

      setInsightsCount(data.insights || 0);
      setJobsCount(data.jobs || 0);
      setContributionsCount(data.contributions || 0);
    } catch (err) {
      console.error("Failed to load dashboard counts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const StatCard = ({ label, value }) => (
    <div className="bg-white shadow rounded-2xl p-4 flex items-center gap-4 min-w-[160px]">
      <div className="flex-1">
        <div className="text-xs text-gray-500">{label}</div>
        <div className="mt-1 font-medium text-2xl">
          {loading ? (
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
          ) : (
            value
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Overview of your private sector activity
          </p>
        </div>
        <button
          onClick={fetchCounts}
          className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg shadow hover:bg-blue-700"
        >
          Refresh
        </button>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Insights" value={insightsCount} />
        <StatCard label="Jobs" value={jobsCount} />
        <StatCard label="Contributions" value={contributionsCount} />
      </section>
    </div>
  );
};

export default PrivateSectorHome;
