import React from "react";
import { useState, useEffect } from "react";
import image from "../../assets/aboutus.jpg";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Spinner from "../../components/Spinner/Spinner";

const About = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <div>
          <div className="container mx-auto pl-15 pr-15 pb-8">
            <div className="pb-10">
              <Navbar />
            </div>
            <div className="bg-blue-50 font-[Poppins]">
              <div className="max-w-6xl mx-auto px-4 py-10">
                <header className="text-center mb-12">
                  <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-2">
                    <br></br>
                    About Bucket List
                  </h1>
                  <p className="text-xl text-orange-600">
                    Unveiling the Wonders of Karnataka
                  </p>
                </header>

                <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
                  <div className="relative">
                    <img
                      src={image}
                      alt="Sri Lankan landscape"
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                  <div>
                    <h2 className="text-3xl font-semibold text-blue-700 mb-4">
                      Our Story
                    </h2>
                    <p className="text-lg text-gray-700 mb-4">
                      Bucket List was born from a passion for sharing the
                      hidden gems of Karnataka with the world. Our journey began
                      in 2025, and since then, we've been crafting unforgettable
                      experiences for travelers from all walks of life.
                    </p>
                    <p className="text-lg text-gray-700">
                    Karnataka is a diverse state in southern India, offering a mix of
                    historical sites, natural beauty, and cultural experiences. It's known for its temples, 
                    palaces, wildlife, beaches, and hill stations. 
                    The state is also a gateway to Southern India, with its capital,
                    Bengaluru, being a major transportation hub.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
                  <h2 className="text-3xl font-semibold text-blue-700 mb-6 text-center">
                    Why Choose Us?
                  </h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="bg-orange-100 rounded-full p-4 inline-block mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-orange-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-blue-600 mb-2">
                        Expert Local Guides
                      </h3>
                      <p className="text-gray-600">
                        Our team of passionate locals will show you the true
                        essence of Karnataka.
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="bg-orange-100 rounded-full p-4 inline-block mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-orange-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-blue-600 mb-2">
                        Tailored Experiences
                      </h3>
                      <p className="text-gray-600">
                        We craft each journey to suit your unique preferences
                        and interests.
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="bg-orange-100 rounded-full p-4 inline-block mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-orange-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-blue-600 mb-2">
                        Sustainable Tourism
                      </h3>
                      <p className="text-gray-600">
                        We're committed to preserving Karnataka's natural beauty
                        for generations to come.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-700 text-white rounded-lg shadow-lg p-8 mb-12">
                  <h2 className="text-3xl font-semibold mb-6 text-center">
                    Our Mission
                  </h2>
                  <p className="text-lg text-center italic">
                    "To showcase the diversity and beauty of Karnataka, creating
                    meaningful connections between travelers and our rich
                    culture, while promoting responsible and sustainable tourism
                    practices."
                  </p>
                </div>

                <div className="text-center">
                  <h2 className="text-3xl font-semibold text-blue-700 mb-6">
                    Ready to Start Your Bucket List?
                  </h2>
                  <a
                    href="/"
                    className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
                    style={{ backgroundColor: "#f97316" }}
                  >
                    Book Your Adventure Now
                  </a>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      )}
    </div>
  );
};

export default About;
