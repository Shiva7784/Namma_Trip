import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

export default function EditSupportTicketPage() {
    const { ticketID } = useParams();
    const navigate = useNavigate();
    const url=import.meta.env.BACKEND_URL;

    // State to hold ticket details
    const [ticket, setTicket] = useState({
        subject: '',
        description: '',
        email: '',
        date: '',
        ticketID: '',
        solution: '',
        isComplete: false,
    });

    // State for loading and errors
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch ticket details by ID when component mounts
    const fetchTicketDetails = async () => {
        try {
            const response = await axios.get(url+`/tickets/get/${ticketID}`);
            setTicket(response.data.ticket); 
            setLoading(false);
        } catch (error) {
            console.error('Error fetching ticket details:', error);
            setError('Error fetching ticket details');
            setLoading(false);
        }
    };

    // Update state when input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTicket({
            ...ticket,
            [name]: value
        });
    };

    // Submit updated ticket details
    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Submitting:', ticket); 

        try {
            const response = await axios.put(url+`/tickets/update/${ticketID}`, ticket);
            console.log('Ticket updated successfully:', response.data);
            alert('Ticket updated successfully');
            navigate('/dashboard'); // Redirect back to tickets list
        } catch (error) {
            console.error('Error updating ticket:', error);
            alert('Error updating ticket');
        }
    };

    // Fetch ticket details on component mount
    useEffect(() => {
        fetchTicketDetails();
    }, [ticketID]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow pt-24 px-4 md:px-8 lg:px-16">
                <center><h1 className="text-2xl font-bold mb-4">Give Solution</h1></center>
                <div className="max-w-2xl mx-auto bg-white p-8 shadow-lg rounded-lg">
                    <form onSubmit={handleSubmit}>
                        {/* Non-editable Ticket ID */}
                        <div className="mb-4">
                            <label htmlFor="ticketID" className="block font-semibold">Ticket ID</label>
                            <input
                                type="text"
                                id="ticketID"
                                name="ticketID"
                                value={ticket.ticketID} 
                                readOnly
                                className="w-full px-4 py-2 border rounded bg-gray-100 cursor-not-allowed"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="subject" className="block font-semibold">Subject</label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={ticket.subject} 
                                readOnly
                                className="w-full px-4 py-2 border rounded bg-gray-100 cursor-not-allowed"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="description" className="block font-semibold">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={ticket.description}  
                                readOnly
                                className="w-full px-4 py-2 border rounded bg-gray-100 cursor-not-allowed"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="block font-semibold">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={ticket.email}
                                readOnly
                                className="w-full px-4 py-2 border rounded bg-gray-100 cursor-not-allowed"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="date" className="block font-semibold">Created On</label>
                            <input
                                type="text"
                                id="date"
                                name="date"
                                value={new Date(ticket.date).toLocaleDateString()} 
                                readOnly
                                className="w-full px-4 py-2 border rounded bg-gray-100 cursor-not-allowed"
                            />
                        </div>

                        {/* Solution field (Editable) */}
                        <div className="mb-4">
                            <label htmlFor="solution" className="block font-semibold">Solution</label>
                            <textarea
                                id="solution"
                                name="solution"
                                value={ticket.solution}  // Display existing solution
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded"
                                required
                            />
                        </div>

                        {/* Status field (Editable) 
                        <div className="mb-4">
                            <label htmlFor="isComplete" className="block font-semibold">Status</label>
                            <select
                                id="isComplete"
                                name="isComplete"
                                value={ticket.isComplete ? 'Complete' : 'Pending'}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded"
                                required
                            >
                                <option value="Pending">Pending</option>
                                <option value="Complete">Complete</option>
                            </select>
                        </div>
                        */}
                        

                        {/* Submit button */}
                        <div className="flex justify-end space-x-4">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                className="bg-gray-600 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition duration-300"
                                onClick={() => navigate('/support-agent-tickets')}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}