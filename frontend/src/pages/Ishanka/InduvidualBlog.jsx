import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import jsPDF from 'jspdf';
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import logo from "../../assets/image.png"; // Your logo path

export default function IndividualBlog() {
    const { id } = useParams();
    const [blog, setBlog] = useState({});
    const url=import.meta.env.BACKEND_URL;

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get(url+`/blog/get/${id}`)
            .then((res) => {
                setBlog(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [id]);

    const downloadPDF = () => {
        const doc = new jsPDF();

        // Load the logo image
        const logoImg = new Image();
        logoImg.src = logo; // Correctly set the logo source

        // Ensure the logo is loaded before generating the PDF
        logoImg.onload = () => {
            // Add the website logo at the top of the document
            doc.addImage(logoImg, 'PNG', 10, 10, 40, 40); // Adjust size and position

            // Set the position for the blog title and author
            doc.setFontSize(22);
            doc.text(blog.title, 10, 60); // Blog title position

            doc.setFontSize(12);
            doc.text(`By: ${blog.author}`, 10, 70); // Author position
            doc.text(`Date: ${new Date(blog.createdAt).toLocaleDateString()}`, 10, 80); // Date position
            
            // Adding blog image if it exists
            if (blog.image) {
                const imageUrl = url+`/BlogImages/${blog.image}`;
                const blogImg = new Image();
                blogImg.src = imageUrl;

                // Wait for the blog image to load before adding it to the PDF
                blogImg.onload = () => {
                    // Add the blog image to the PDF above the content
                    doc.addImage(blogImg, 'JPEG', 10, 90, 180, 100); // Adjust size and position
                    
                    // Start adding the content
                    addContentToPDF(doc, blog.content, blog.title);
                };

                // Handle image loading error
                blogImg.onerror = () => {
                    console.error("Failed to load blog image");
                    addContentToPDF(doc, blog.content, blog.title); // Save PDF without image
                };
            } else {
                // If there's no blog image, proceed to add content
                addContentToPDF(doc, blog.content, blog.title);
            }
        };

        // Handle logo loading error
        logoImg.onerror = () => {
            console.error("Failed to load logo image");
        };
    };

    const addContentToPDF = (doc, content, title) => {
        // Set the starting position for the content
        let yPosition = 200; // Starting position for content after the image
        doc.setFontSize(10);

        // Add "Content:" header
        doc.text("Content:", 10, yPosition);
        yPosition += 10; // Move down after header

        // Split content into lines that fit within the page width
        const contentLines = doc.splitTextToSize(content, 180); // Split text to fit within the page width

        // Loop through the content lines and add them to the PDF
        contentLines.forEach((line) => {
            if (yPosition > 280) { // Check if we need to add a new page
                doc.addPage(); // Add a new page
                yPosition = 10; // Reset Y position for the new page
                doc.text(title, 10, 10); // Add title on the new page
                doc.text("Content:", 10, 20); // Add content header on the new page
                yPosition = 30; // Reset position for content
            }
            doc.text(line, 10, yPosition); // Add line to the PDF
            yPosition += 10; // Move down for the next line
        });

        // Finally, save the PDF
        doc.save(`${title}.pdf`); // Save the PDF after all content is added
    };

    return (
        <div>
            <div className="pb-10">
                <Navbar />
            </div>
            <div className="max-w-3xl mx-auto mt-6 md:mt-10 pt-20 px-4">
                <h1 className="text-4xl font-bold text-center mb-8">{blog.title}</h1>
                
                <div className="mb-8 text-center">
                    <p className="text-lg text-gray-600">
                        By <span className="font-semibold">{blog.author}</span> | 
                        {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                </div>
                
                {blog.image && (
                    <img
                        src={url+`/BlogImages/${blog.image}`}
                        alt={blog.title}
                        className="w-full h-auto object-cover rounded-lg mb-8 shadow-lg"
                    />
                )}
                
                <div className="bg-gray-100 rounded-lg shadow-lg p-6 mb-8">
                    <p className="text-lg leading-relaxed whitespace-pre-wrap">
                        {blog.content}
                    </p>
                </div>
                
                <div className="text-center mb-4">
                    <button 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                        onClick={downloadPDF}
                    >
                        Download Blog as PDF
                    </button>
                </div>
            </div>
            <div>
                <Footer />
            </div>
        </div>
    );
}
