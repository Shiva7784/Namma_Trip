import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

export default function TourismBlog() {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const url=import.meta.env.BACKEND_URL;

  useEffect(() => {
    // Fetching blogs from the API
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(url+"/blog"); // Adjusted endpoint to match your router
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  return (
    <div>
      <div className="pb-10">
        <Navbar />
      </div>
      <div className="min-h-screen bg-gradient-to-br from-sky-100 to-sky-200 mt-6 md:mt-10 md:mx-10 pt-20">
        <nav className="bg-sky-500 text-white py-6 sticky top-0 z-10 shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center ml-20">
              <h1 className="text-3xl font-bold text-black text-center w-full">
                   Discover Karnataka
              </h1>
              <div className="relative w-full max-w-xs ">
                
               
                <input
                  type="text"
                  placeholder="Search adventures..."
                  className="w-full py-2 px-4 pr-10 rounded-full text-black focus:outline-none focus:ring-2 focus:ring-sky-300 transition duration-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sky-600"
                  size={20}
                />
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <Link
                to={`/blog/${blog._id}`}
                key={blog._id}
                className="bg-white rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="relative">
                  {blog.image && ( // Render image if it exists
                    <img
                      src={url+`/BlogImages/${blog.image}`} // Adjust image path
                      alt={blog.title}
                      className="w-full h-64 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-sky-700 mb-2">
                      {blog.title}
                    </h2>
                    <div className="flex items-center text-gray-600 mb-2">
                      <span>{blog.author}</span>
                      <span className="ml-4">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <span className="inline-block bg-sky-500 text-white py-2 px-4 rounded-full hover:bg-sky-600 transition duration-300 transform hover:translate-y-1">
                      Read More
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
