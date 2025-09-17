// pages/BlogListPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../lib/API";

const BlogListPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}blog?status=published`);
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (loading) return <div className="p-6">Loading blogs...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Student Blogs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow">
            <img
              src={blog.coverImage || "/default-blog.jpg"}
              alt={blog.title}
              className="w-full h-40 object-cover rounded-lg mb-3"
            />
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500">{blog.company?.name}</span>
              <span className="text-xs text-gray-400">{blog.category}</span>
            </div>
            <h2 className="text-lg font-semibold mb-2">{blog.title}</h2>
            <p className="text-sm text-gray-600 mb-3">
              {blog.content.slice(0, 120)}...
            </p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Views: {blog.viewsCount}</span>
              <span>Likes: {blog.likesCount}</span>
            </div>
            <Link
              to={`/blogs/${blog.id}`}
              className="mt-3 inline-block text-blue-600 hover:underline text-sm"
            >
              Read more
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogListPage;
