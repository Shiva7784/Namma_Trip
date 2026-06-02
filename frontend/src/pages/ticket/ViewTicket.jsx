import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

export default function ViewTicket() {
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const url=import.meta.env.BACKEND_URL;

    // Fetch ticket details
    const fetchTicket = async (id) => {
        try {
            const response = await axios.get(url+`/tickets/get/${id}`);
            setTicket(response.data.ticket);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.error || 'Error fetching ticket details');
            setLoading(false);
        }
    };

    const ticketID = window.location.pathname.split('/').pop();

    useEffect(() => {
        fetchTicket(ticketID);
    }, [ticketID]);

    if (loading) return <p>Loading ticket details...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
            <Navbar />

            <main className="flex-grow p-4 md:p-8 lg:p-16">
                {ticket ? (
                    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                        <div className="p-6">
                            <h1 className="text-4xl font-bold mb-6 text-center text-gray-900 dark:text-white">
                                Ticket ID: TIC{ticket.ticketID.toString().padStart(4, '0')}
                            </h1>

                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                                <strong>Description:</strong> {ticket.description}
                            </p>

                            <div className="mb-6">
                                <p className="text-gray-700 dark:text-gray-300"><strong>Status:</strong> {ticket.isComplete ? "Complete" : "Incomplete"}</p>
                                <p className="text-gray-700 dark:text-gray-300"><strong>Created On:</strong> {new Date(ticket.createdAt).toLocaleDateString()}</p>
                                <p className="text-gray-700 dark:text-gray-300"><strong>Customer Email:</strong> {ticket.customerEmail}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>No details available.</p>
                )}
            </main>

            <Footer />
        </div>
    );
}
