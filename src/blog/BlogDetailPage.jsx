import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../lib/API";

const BlogDetailPage = ({ studentId }) => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/blogs/${id}`);
      const data = await res.json();
      setBlog(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      setSubmitting(true);
      await fetch(`${API_URL}/blogs/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, comment }),
      });
      setComment("");
      fetchBlog(); // refresh comments
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6">Loading blog...</div>;
  if (!blog) return <div className="p-6">Blog not found</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
      <div className="text-sm text-gray-500 mb-4 flex justify-between">
        <span>Company: {blog.company?.name}</span>
        <span>Category: {blog.category}</span>
      </div>
      {blog.coverImage && (
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-60 object-cover rounded-lg mb-4"
        />
      )}
      <div className="prose dark:prose-invert max-w-full">{blog.content}</div>
      <div className="flex gap-4 mt-6 text-sm text-gray-500">
        <span>Views: {blog.viewsCount}</span>
        <span>Likes: {blog.likesCount}</span>
      </div>

      {/* Comments Section */}
      <div className="mt-8">
        <h2 className="font-semibold mb-4">Comments</h2>

        <form onSubmit={handleSubmitComment} className="mb-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment..."
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-700 mb-2"
            rows={3}
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </form>

        {blog.BlogComments && blog.BlogComments.length > 0 ? (
          <ul className="space-y-2">
            {blog.BlogComments.map((c) => (
              <li
                key={c.id}
                className="bg-gray-100 dark:bg-slate-700 p-3 rounded-lg"
              >
                <p className="text-sm">{c.comment}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default BlogDetailPage;
