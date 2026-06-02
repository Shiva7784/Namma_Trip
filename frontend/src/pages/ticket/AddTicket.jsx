import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

export default function AddTicket() {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const url=import.meta.env.BACKEND_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic frontend validation
        if (!subject || !description || !email) {
            alert('Please fill in all required fields.');
            return;
        }
        
        const emailPattern = /.+\@.+\..+/;
        if (!emailPattern.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        try {
            const newTicket = { subject, description, priority, email };
            await axios.post(url+'/tickets/add', newTicket);
            alert('Ticket added successfully!');
            navigate('/tickets'); // Redirect to AllTickets after successful submission
        } catch (error) {
            console.error('Error adding ticket:', error);
            alert('Failed to add ticket.');
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow pt-24 px-4 md:px-8 lg:px-16">
                <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg p-6">
                    <h1 className="text-2xl font-bold text-center mb-4">Create Ticket</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium">Subject</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-300 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-300 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={3} // Adjust the height if needed
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium">Priority</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium">Customer Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-300 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-200 ease-in-out"
                        >
                            Add Ticket
                        </button>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}
