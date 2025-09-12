import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiDownload,
  FiEye,
  FiFileText,
  FiCalendar,
  FiUser,
} from "react-icons/fi";


const Contributions = () => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContribution, setEditingContribution] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "article",
    description: "",
    status: "draft",
    tags: [],
    file_url: "",
  });
  const [newTag, setNewTag] = useState("");

  // Fetch contributions
  useEffect(() => {
    const fetchContributions = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token_ineco");
        const response = await fetch("http://localhost:3000/api/contributions", {
          method: "GET",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Map backend fields to frontend expected fields
  const mappedContributions = data.contributions.map((contribution) => ({
          id: contribution.contribution_id,
          title: contribution.title,
          type: contribution.type,
          description: contribution.description,
          author: contribution.author,
          date_created: contribution.date_created,
          status: contribution.status,
          tags: contribution.tags || [],
          file_url: contribution.file_url
        }));
        
        setContributions(mappedContributions);
      } catch (err) {
        console.error("Fetch error:", err);
        setContributions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, []);

  const openDialog = (contribution) => {
    if (contribution) {
      setEditingContribution(contribution);
      setFormData(contribution);
    } else {
      setEditingContribution(null);
      setFormData({
        title: "",
        type: "article",
        description: "",
        status: "draft",
        tags: [],
        file_url: "",
      });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingContribution(null);
    setNewTag("");
  };

  const addTag = () => {
    if (newTag.trim() && formData.tags) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (index) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index) || [],
    }));
  };

  const saveContribution = async () => {
    // Validate required fields
    if (!formData.title) {
      alert("Title is required");
      return;
    }

    try {
      const token = localStorage.getItem("token_ineco");
      const url = editingContribution 
        ? `http://localhost:3000/api/contributions/${editingContribution.id}` 
        : "http://localhost:3000/api/contributions";

      const method = editingContribution ? "PUT" : "POST";

      // Map frontend fields to backend fields
      const requestData = {
        title: formData.title,
        type: formData.type,
        description: formData.description,
        tags: formData.tags || [],
        file_url: formData.file_url,
        status: formData.status
      };

      const response = await fetch(url, {
        method: method,
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to save contribution");
      }

      // Map backend response to frontend format
      const mappedContribution = {
        id: responseData.contribution.contribution_id,
        title: responseData.contribution.title,
        type: responseData.contribution.type,
        description: responseData.contribution.description,
        author: responseData.contribution.author,
        date_created: responseData.contribution.date_created,
        status: responseData.contribution.status,
        tags: responseData.contribution.tags || [],
        file_url: responseData.contribution.file_url
      };
      
      if (editingContribution) {
        setContributions(prev => prev.map(c => 
          c.id === editingContribution.id ? mappedContribution : c
        ));
      } else {
        setContributions(prev => [...prev, mappedContribution]);
      }
      
      closeDialog();
      alert("Contribution saved successfully!");
  } catch (error) {
      console.error("Error saving contribution:", error);
      alert(error.message || "Failed to save contribution");
    }
  };

  const deleteContribution = async (id) => {
    if (!confirm("Are you sure you want to delete this contribution?")) return;

    try {
      const token = localStorage.getItem("token_ineco");
      const response = await fetch(`http://localhost:3000/api/contributions/${id}`, {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        setContributions(prev => prev.filter(c => c.id !== id));
        alert("Contribution deleted successfully!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete contribution");
      }
  } catch (error) {
      console.error("Error deleting contribution:", error);
      alert(error.message || "Failed to delete contribution");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "draft":
        return "bg-gray-600";
      case "published":
        return "bg-green-600";
      case "archived":
        return "bg-slate-600";
      default:
        return "bg-gray-600";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "draft": return "Draft";
      case "published": return "Published";
      case "archived": return "Archived";
      default: return status;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "article": return "Article";
      case "research": return "Research";
      case "tutorial": return "Tutorial";
      case "news": return "News";
      case "other": return "Other";
      default: return type;
    }
  };

  return (
    <div className="min-h-screen dark:bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-white text-2xl mb-2">Contributions</h1>
            <p className="text-slate-400">
              Manage reports, research, and industry contributions
            </p>
          </div>
          <button
            onClick={() => openDialog()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FiPlus /> Add Contribution
          </button>
        </div>

        {/* Contributions List */}
        <div className="grid gap-4">
          {loading ? (
            <div className="text-white text-center py-8">Loading contributions...</div>
          ) : contributions.length === 0 ? (
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
              <FiFileText className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <h3 className="text-slate-400 text-lg mb-2">No contributions yet</h3>
              <p className="text-slate-500 mb-4">
                Start adding reports, research papers, and other valuable contributions.
              </p>
              <button
                onClick={() => openDialog()}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FiPlus /> Add First Contribution
              </button>
            </div>
          ) : (
            contributions.map((contribution) => (
              <div
                key={contribution.id}
                className="bg-slate-800 border border-slate-700 rounded-lg p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white text-lg">{contribution.title}</h3>
                      <span
                        className={`text-white text-sm px-2 py-1 rounded ${getStatusColor(
                          contribution.status
                        )}`}
                      >
                        {getStatusLabel(contribution.status)}
                      </span>
                    </div>
                    <div className="flex gap-2 mb-3 flex-wrap">
                      <span className="bg-purple-600 text-white text-sm px-2 py-1 rounded flex items-center gap-1">
                        <FiFileText /> {getTypeLabel(contribution.type)}
                      </span>
                      <span className="border border-slate-600 text-slate-300 text-sm px-2 py-1 rounded flex items-center gap-1">
                        <FiUser /> {contribution.author.first_name} {contribution.author.last_name}
                      </span>
                      <span className="border border-slate-600 text-slate-300 text-sm px-2 py-1 rounded flex items-center gap-1">
                        <FiCalendar />{" "}
                        {new Date(contribution.date_created).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {contribution.file_url && (
                      <>
                        <button
                          onClick={() => window.open(contribution.file_url, "_blank")}
                          className="text-green-400 hover:text-green-300 hover:bg-green-400/10 p-2 rounded transition-colors"
                          title="View File"
                        >
                          <FiEye />
                        </button>
                        <button
                          onClick={() => window.open(contribution.file_url, "_blank")}
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 p-2 rounded transition-colors"
                          title="Download File"
                        >
                          <FiDownload />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => openDialog(contribution)}
                      className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 p-2 rounded transition-colors"
                      title="Edit Contribution"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => deleteContribution(contribution.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 rounded transition-colors"
                      title="Delete Contribution"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>

                {contribution.description && (
                  <p className="text-slate-400 mb-4">{contribution.description}</p>
                )}

                {contribution.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {contribution.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="border border-slate-600 text-slate-300 text-sm px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Dialog */}
        {isDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 border border-slate-700 text-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {editingContribution ? "Edit Contribution" : "Add Contribution"}
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
                  <label className="block text-slate-300 mb-1">Title *</label>
                  <input
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2"
                    placeholder="Enter contribution title"
                    required
                  />
                </div>

                {/* Type & Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          type: e.target.value,
                        }))
                      }
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2"
                    >
                      <option value="article">Article</option>
                      <option value="research">Research</option>
                      <option value="tutorial">Tutorial</option>
                      <option value="news">News</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-slate-300 mb-1">Description</label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 min-h-32"
                    placeholder="Describe your contribution..."
                  />
                </div>

                {/* File URL */}
                <div>
                  <label className="block text-slate-300 mb-1">File URL</label>
                  <input
                    type="text"
                    value={formData.file_url || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, file_url: e.target.value }))
                    }
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2"
                    placeholder="https://example.com/document.pdf"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-slate-300 mb-1">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-600 text-white text-sm px-2 py-1 rounded flex items-center gap-1"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(index)}
                          className="ml-1 hover:text-red-300"
                        >
                          <FiTrash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addTag()}
                      className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2"
                      placeholder="Add tag..."
                    />
                    <button
                      onClick={addTag}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-white transition-colors"
                    >
                      <FiPlus />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={closeDialog}
                    className="px-4 py-2 rounded border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveContribution}
                    className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  >
                    {editingContribution ? "Update Contribution" : "Add Contribution"}
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

export default Contributions;