import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UpdateBlogForm() {
    const { id } = useParams();
    const [blog, setBlog] = useState({
        title: '',
        author: '',
        content: '',
        image: null, // Set to null for file handling
    });

    const [loading, setLoading] = useState(true);
    const url=import.meta.env.BACKEND_URL;

    useEffect(() => {
        if (!id) {
            return;
        }

        // Fetch the blog data by id
        axios.get(url+`/blog/get/${id}`)
            .then((res) => {
                setBlog(res.data); // Set the blog data to the state
                setLoading(false);  // Set loading to false after data is loaded
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    }, [id]);

    // Handle text input changes
    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
    
        if (name === "blogImage") {
            // Handle file input
            setBlog((prevBlog) => ({
                ...prevBlog,
                image: files[0],  // Store the file itself
            }));
        } else {
            setBlog((prevBlog) => ({
                ...prevBlog,
                [name]: value,
            }));
        }
    }

    // Handle file input changes (for image)
    const handleImageChange = (e) => {
        const file = e.target.files[0]; // Get the uploaded file
        setBlog((prevBlog) => ({
            ...prevBlog,
            image: file, // Set the file in state
        }));
    };

    const Navigate = useNavigate();

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append("title", blog.title);
        formData.append("author", blog.author);
        formData.append("content", blog.content);
    
        if (blog.image) {
            formData.append("blogImage", blog.image); // Ensure the field name matches
        }
    
        try {
            await axios.put(url+`/blog/update/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            alert('Blog updated successfully!');
            Navigate('/dashboard');
        } catch (err) {
            console.error(err);
        }
    };

    // Wait for the blog data to load before rendering the form
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto mt-10">
            <h1 className="text-3xl font-bold mb-6">Update Blog</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={blog.title}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Author</label>
                    <input
                        type="text"
                        name="author"
                        value={blog.author}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Content</label>
                    <textarea
                        name="content"
                        value={blog.content}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        rows="8"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Upload Image</label>
                    <input
                        type="file"
                        name="blogImage"  // <-- Ensure this matches the multer field
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div className="text-right">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                    >
                        Update Blog
                    </button>
                </div>
            </form>
        </div>
    );
}
