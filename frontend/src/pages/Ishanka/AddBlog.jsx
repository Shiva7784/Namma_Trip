import React, { useState } from 'react';
import axios from 'axios';

function AddBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [blogImage, setBlogImage] = useState(null); 
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  function addBlog(e) {
    e.preventDefault();

    const blog = {
      title,
      content,
      author,
      blogImage,
    };

    const url=import.meta.env.BACKEND_URL;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("author", author);
    if (blogImage) {
      formData.append("blogImage", blogImage);
    }

    axios.post(url+"/blog/add", formData)
      .then(() => {
        setSuccessMessage('✅ Blog added successfully!');
        setTitle('');
        setContent('');
        setAuthor('');
        setBlogImage(null);

        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      })
      .catch((err) => {
        alert(err);
      });
  }

  return (
    <>
      {successMessage && (
        <div className="mb-4 p-4 text-white bg-green-500 rounded-md text-center shadow-lg">
          {successMessage}
        </div>
      )}
      <section className="max-w-4xl p-8 mx-auto bg-white rounded-md shadow-lg mt-20 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create a New Blog</h1>
  
        <form onSubmit={addBlog}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="text-gray-700 font-semibold" htmlFor="title">Blog Title</label>
              <input
                id="title"
                type="text"
                className="block w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setTitle(e.target.value)}
              />
              {errors.title && <p className="text-red-600 mt-1 text-sm">{errors.title}</p>}
            </div>
  
            <div>
              <label className="text-gray-700 font-semibold" htmlFor="author">Author Name</label>
              <input
                id="author"
                type="text"
                className="block w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setAuthor(e.target.value)}
              />
              {errors.author && <p className="text-red-600 mt-1 text-sm">{errors.author}</p>}
            </div>
  
            <div className="col-span-2">
              <label className="text-gray-700 font-semibold" htmlFor="content">Blog Content</label>
              <textarea
                id="content"
                className="block w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="6"
                onChange={(e) => setContent(e.target.value)}
              />
              {errors.content && <p className="text-red-600 mt-1 text-sm">{errors.content}</p>}
            </div>
  
            <div>
              <label className="block mb-2 text-gray-700 font-semibold" htmlFor="blogImage">Upload Blog Image</label>
              <input
                name="blogImage"
                className="block w-full text-gray-700 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                id="blogImage"
                type="file"
                onChange={(e) => {
                  setBlogImage(e.target.files[0]);
                }}
              />
            </div>
          </div>
  
          <div className="flex justify-center mt-6">
            <button type="submit" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition-colors">
              Publish Blog
            </button>
          </div>
        </form>
      </section>
    </>
  );
  
}

export default AddBlog;
