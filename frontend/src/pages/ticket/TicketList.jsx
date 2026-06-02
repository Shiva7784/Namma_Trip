import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

export default function TicketList() {
    const [tickets, setTickets] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const navigate = useNavigate();
    const url=import.meta.env.BACKEND_URL;

    // Fetch all tickets
    const fetchTickets = async () => {
        try {
            const response = await axios.get(url+'/tickets/');
            setTickets(response.data);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    };

    useEffect(() => {
        fetchTickets();

        const interval = setInterval(() => {
            fetchTickets();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const handleThumbnailClick = (ticketId) => {
        navigate(`/ticket/${ticketId}`);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    };

    // Filter tickets 
    const filteredTickets = tickets.filter(ticket =>
        (ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedStatus === "All" || 
         (selectedStatus === "Complete" && ticket.isComplete) || 
         (selectedStatus === "Incomplete" && !ticket.isComplete))
    );

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <br/><br/>

            <main className="flex-grow pt-16 px-4 md:px-8 lg:px-16">
                <h1 className="text-2xl font-bold mb-4">Ticket List</h1>

                <div className="flex flex-wrap gap-4 mb-4">
                    {/* Search Input */}
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search by subject or description..."
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex-1">
                        <select
                            value={selectedStatus}
                            onChange={handleStatusChange}
                            className="p-2 border border-gray-300 rounded-lg w-full"
                        >
                            <option value="All">All Tickets</option>
                            <option value="Complete">Complete</option>
                            <option value="Incomplete">Incomplete</option>
                        </select>
                    </div>
                </div>

                <br/>

                {/* Ticket List */}
                <div className="space-y-4">
                    {filteredTickets.length > 0 ? (
                        filteredTickets.map(ticket => (
                            <div key={ticket._id} className="border rounded-lg p-4 bg-white shadow-md dark:bg-gray-800 dark:border-gray-700">
                                <div className="flex items-center mb-4">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{ticket.subject}</h2>
                                        <p className="text-gray-700 dark:text-gray-400">{ticket.description}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{ticket.isComplete ? "Status: Complete" : "Status: Incomplete"}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Priority: {ticket.priority}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Date Submitted: {new Date(ticket.date).toLocaleDateString()}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Solution: {ticket.solution || "N/A"}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Customer Email: {ticket.email || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No tickets available.</p>
                    )}
                </div>
            </main>

            <br/><br/>

            <Footer />
        </div>
    );
}
