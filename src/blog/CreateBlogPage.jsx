import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../lib/API";

const CreateBlogPage = ({ companyId }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("career");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    const payload = {
      companyId,
      title,
      content,
      category,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      coverImage,
      status: "published",
    };

    try {
      setSubmitting(true);
      const res = await fetch(`${API_URL}/blogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create blog");
      const data = await res.json();
      navigate(`/blogs/${data.blog.id}`);
    } catch (err) {
      console.error(err);
      alert("Error creating blog");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold mb-4">Create Blog Post</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Title</label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg dark:bg-slate-800"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Content</label>
          <textarea
            rows={10}
            className="w-full p-3 border rounded-lg dark:bg-slate-800"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog content here..."
            required
          ></textarea>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-semibold">Category</label>
            <select
              className="w-full p-3 border rounded-lg dark:bg-slate-800"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="career">Career</option>
              <option value="skills">Skills</option>
              <option value="market">Market</option>
              <option value="internships">Internships</option>
              <option value="technology">Technology</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block mb-1 font-semibold">Tags (comma-separated)</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg dark:bg-slate-800"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., AI, CV, Skills"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Cover Image URL</label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg dark:bg-slate-800"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="Optional"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {submitting ? "Creating..." : "Create Blog"}
        </button>
      </form>

      {/* Live Preview */}
      <div className="mt-8 p-6 border rounded-xl bg-gray-50 dark:bg-slate-800 shadow">
        <h2 className="text-xl font-bold mb-2">Live Preview</h2>
        {coverImage && (
          <img
            src={coverImage}
            alt="Cover"
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}
        <p className="text-sm text-gray-500 mb-2">Category: {category}</p>
        <h3 className="text-lg font-semibold mb-2">{title || "Blog Title"}</h3>
        <div className="mb-2">{content || "Blog content will appear here..."}</div>
        {tags && (
          <div className="flex flex-wrap gap-2">
            {tags.split(",").map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateBlogPage;
