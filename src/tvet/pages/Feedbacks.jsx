import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/useAuth';
import { API_URL } from '../../lib/API';

const Analytics = () => {
  const { user } = useAuth();
  const token = typeof window !== "undefined" ? localStorage.getItem("token_ineco") : null;

  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      if (!token) return;

      setLoading(true);
      try {
        const response = await fetch(`${API_URL}insights`, {
          method: "GET",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (data.success) {
          setInsights(data.insights);
        } else {
          throw new Error(data.message || "Failed to fetch insights");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setInsights([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [token]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-600';
      case 'medium': return 'bg-yellow-600';
      case 'low': return 'bg-green-600';
      default: return 'bg-yellow-600';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return priority;
    }
  };

  return (
    <div className="min-h-screen dark:bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-white text-2xl mb-2">Industry Insights</h1>
          <p className="text-slate-400">Track industry trends and skills gap analysis</p>
        </div>

        {loading ? (
          <div className="text-white">Loading Insights...</div>
        ) : insights.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
            <h3 className="text-slate-400 text-lg mb-2">No insights yet</h3>
            <p className="text-slate-500 mb-4">No industry insights to display at this time.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {insights.map(insight => (
              <div key={insight.insight_id} className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white text-lg">{insight.title}</h3>
                      <span className={`${getPriorityColor(insight.priority)} text-white px-2 py-1 rounded text-xs`}>
                        {getPriorityLabel(insight.priority)}
                      </span>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">{insight.sector}</span>
                      <span className="border border-slate-600 text-slate-300 px-2 py-1 rounded text-xs">
                        {new Date(insight.date_created).toLocaleDateString()}
                      </span>
                      {insight.author && (
                        <span className="border border-slate-600 text-slate-300 px-2 py-1 rounded text-xs">
                          By: {insight.author.company_name || `${insight.author.first_name} ${insight.author.last_name}`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-slate-300 mb-2">Skills Gap Analysis & Suggestions</h4>
                  <p className="text-slate-400 leading-relaxed">{insight.skills_gap_suggestion}</p>
                </div>

                {insight.tags && insight.tags.length > 0 && (
                  <div>
                    <h4 className="text-slate-300 mb-2">Related Skills & Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {insight.tags.map((tag, index) => (
                        <span key={index} className="border border-slate-600 text-slate-300 px-2 py-1 rounded text-xs">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
