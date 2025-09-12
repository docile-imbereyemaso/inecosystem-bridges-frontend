import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/useAuth';
import { API_URL } from '../../lib/API';

// ...existing code...

function Analytics() {
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
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
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

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInsight, setEditingInsight] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    sector: '',
    skills_gap_suggestion: '',
    priority: 'medium',
    tags: []
  });

  const [newTag, setNewTag] = useState('');

  const openDialog = (insight = null) => {
    if (insight) {
      setEditingInsight(insight);
      setFormData({
        title: insight.title,
        sector: insight.sector,
        skills_gap_suggestion: insight.skills_gap_suggestion,
        priority: insight.priority,
        tags: insight.tags || []
      });
    } else {
      setEditingInsight(null);
      setFormData({
        title: '',
        sector: '',
        skills_gap_suggestion: '',
        priority: 'medium',
        tags: []
      });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingInsight(null);
    setNewTag('');
  };

  const addTag = () => {
    if (newTag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const saveInsight = async () => {
    if (!token) {
      alert("You need to be logged in to save insights");
      return;
    }
    try {
      const url = editingInsight 
        ? `${API_URL}insights/${editingInsight.insight_id}`
        : `${API_URL}insights`;
      const method = editingInsight ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      const responseData = await response.json();
      if (!response.ok) {
        const errorMessage = responseData.error || responseData.message || "Failed to save insight";
        throw new Error(errorMessage);
      }
      if (responseData.success) {
        if (editingInsight) {
          setInsights(prev => prev.map(insight => 
            insight.insight_id === editingInsight.insight_id ? responseData.insight : insight
          ));
        } else {
          setInsights(prev => [...prev, responseData.insight]);
        }
        closeDialog();
        alert(responseData.message || "Insight saved successfully");
      } else {
        throw new Error(responseData.message || "Failed to save insight");
      }
    } catch (error) {
      console.error("Save insight error:", error);
    alert(`Error: ${error.message}`);
    }
  };

  const deleteInsight = async (id) => {
    if (!token) {
      alert("You need to be logged in to delete insights");
      return;
    }

    if (!confirm("Are you sure you want to delete this insight?")) return;

    try {
      const response = await fetch(`${API_URL}insights/${id}`, {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to delete insight");
      }

      if (responseData.success) {
        setInsights(prev => prev.filter(insight => insight.insight_id !== id));
        alert("Insight deleted successfully");
      } else {
        throw new Error(responseData.message || "Failed to delete insight");
      }
  } catch (error) {
      console.error("Delete insight error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'medium':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case 'low':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-600';
      case 'medium':
        return 'bg-yellow-600';
      case 'low':
        return 'bg-green-600';
      default:
        return 'bg-yellow-600';
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
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-white text-2xl mb-2">Industry Insights</h1>
            <p className="text-slate-400">Track industry trends and skills gap analysis</p>
          </div>
          <button 
            onClick={() => openDialog()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Insight
          </button>
        </div>

        {/* Insights Cards */}
        <div className="grid gap-4">
          {loading ? (
            <div className="text-white">Loading Insights...</div>
          ) : insights.length === 0 ? (
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
              <svg className="w-12 h-12 text-slate-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <h3 className="text-slate-400 text-lg mb-2">No insights yet</h3>
              <p className="text-slate-500 mb-4">Start tracking industry trends and skills gaps to build valuable insights.</p>
              <button 
                onClick={() => openDialog()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add First Insight
              </button>
            </div>
          ) : (
            insights.map((insight) => (
              <div key={insight.insight_id} className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white text-lg">{insight.title}</h3>
                      <span className={`${getPriorityColor(insight.priority)} text-white px-2 py-1 rounded text-xs flex items-center gap-1`}>
                        {getPriorityIcon(insight.priority)}
                        {getPriorityLabel(insight.priority)}
                      </span>
                      {insight.status && (
                        <span className="bg-gray-600 text-white px-2 py-1 rounded text-xs">
                          {insight.status}
                        </span>
                      )}
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
                  {user?.user_id === insight.created_by && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => openDialog(insight)}
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 p-2 rounded transition-colors"
                        title="Edit Insight"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteInsight(insight.insight_id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 rounded transition-colors"
                        title="Delete Insight"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
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
                        <span key={index} className="border border-slate-600 text-slate-300 px-2 py-1 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
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
                  {editingInsight ? 'Edit Insight' : 'Add New Insight'}
                </h2>
                <button
                  onClick={closeDialog}
                  className="text-slate-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-slate-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter insight title..."
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2"
                  />
                </div>

                {/* Sector and Priority */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1">Sector</label>
                    <select
                      value={formData.sector || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, sector: e.target.value }))}
                      className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2"
                    >
                      <option value="">Select sector</option>
                      <option value="Technology">Technology</option>
                      <option value="Finance">Finance</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Design">Design</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Education">Education</option>
                      <option value="Retail">Retail</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Priority</label>
                    <select
                      value={formData.priority || 'medium'}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                {/* Skills Gap Suggestion */}
                <div>
                  <label className="block text-slate-300 mb-1">Skills Gap Suggestion</label>
                  <textarea
                    value={formData.skills_gap_suggestion || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, skills_gap_suggestion: e.target.value }))}
                    placeholder="Describe the skills gap and provide suggestions for addressing it..."
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2 min-h-32"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-slate-300 mb-1">Tags</label>
                  <div className="flex flex-wrap gap-2 mt-2 mb-2">
                    {formData.tags?.map((tag, index) => (
                      <span key={index} className="bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                        {tag}
                        <button
                          onClick={() => removeTag(index)}
                          className="hover:bg-blue-700 p-0.5 rounded"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag..."
                      className="flex-1 bg-slate-700 border border-slate-600 text-white rounded px-3 py-2"
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <button 
                      onClick={addTag}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
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
                    onClick={saveInsight}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    {editingInsight ? 'Update Insight' : 'Add Insight'}
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

export default Analytics;