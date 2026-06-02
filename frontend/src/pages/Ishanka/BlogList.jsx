import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const url=import.meta.env.BACKEND_URL;

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(url+"/blog/");
      setBlogs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteBlog = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this Blog?");
    if (confirmed) {
      try {
        await axios.delete(url+`/blog/delete/${id}`);
        alert("Blog deleted successfully!");
        fetchBlogs();
      } catch (error) {
        console.error('Error deleting blog:', error);
        alert('Blog deletion failed.');
      }
    }
  };

  return (
    <>
      <section className="max-w-7xl p-6 mx-auto bg-gray-700 rounded-md shadow-md dark:bg-gray-800 mt-20">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold text-white capitalize dark:text-white">Blog List</h1>
        </div>

        <div className="space-y-6">
          {blogs.map((blog) => (
            <div key={blog._id} className="flex items-start p-4 bg-white rounded-md shadow-md dark:bg-gray-800">
              <div className="flex-shrink-0 mr-4">
                <img
                  src={url+"/blogImages/" + blog.image}
                  alt={blog.title}
                  className="w-32 h-32 object-cover rounded-md border border-gray-300"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">{blog.title}</h2>
                <p className="text-gray-600 dark:text-gray-300">Author: {blog.author}</p>
                <p className="text-gray-600 dark:text-gray-400 mt-2 line-clamp-3">{blog.content.substring(0, 20)}...</p>
              </div>
              <div className="flex items-center space-x-4 ml-4">
                <button
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
                  onClick={() => deleteBlog(blog._id)}
                >
                  Delete
                </button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
                  <Link to={`/update-blog/${blog._id}`} state={{ blogToEdit: blog }}>
                    Update
                  </Link>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default BlogList;
