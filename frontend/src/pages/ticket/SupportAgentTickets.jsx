import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function AllTickets() {
    const [tickets, setTickets] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const url=import.meta.env.BACKEND_URL;

    const fetchTickets = async () => {
        try {
            const response = await axios.get(url+'/tickets/');
            setTickets(response.data);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    };

    // Delete ticket
    const deleteTicket = async (ticketID) => {
        if (window.confirm('Are you sure you want to delete this ticket?')) {
            try {
                await axios.delete(url+`/tickets/delete/${ticketID}`);
                setTickets(tickets.filter(ticket => ticket._id !== ticketID));
            } catch (error) {
                console.error('Error deleting ticket:', error);
            }
        }
    };

    // Edit ticket
    const editTicket = (ticketID) => {
        navigate(`/tickets/edit-support/${ticketID}`);
    };


    // Generate Excel report
    const generateExcelReport = () => {
        const wb = XLSX.utils.book_new();
        const wsData = tickets.map(ticket => ({
            TicketID: `TIC${ticket.ticketID.toString().padStart(4, '0')}`,
            Subject: ticket.subject,
            Description: ticket.description,
            Email: ticket.email,  // Add email field to report
            Status: ticket.isComplete ? 'Complete' : 'Incomplete',
            CreatedOn: new Date(ticket.date).toLocaleDateString(),
            Solution: ticket.solution || 'Pending',
        }));
        const ws = XLSX.utils.json_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, 'Tickets');
        XLSX.writeFile(wb, 'tickets_report.xlsx');
    };

    // Generate PDF report with logo
    const generatePDFReport = () => {
        const doc = new jsPDF();

        const logoURL = `${window.location.origin}/logo12.jpg`;

        // Adding the image to the PDF
        const img = new Image();
        img.src = logoURL;
        img.onload = function () {
            
            doc.addImage(img, 'JPG', 10, 10, 50, 20);

            doc.setFontSize(18);
            doc.text('Tickets Report', 20, 40);

            // Define table columns and rows
            const tableColumn = ['Ticket ID', 'Subject', 'Description', 'Status', 'Created On', 'Solution'];
            const tableRows = [];

            tickets.forEach(ticket => {
                const ticketData = [
                    `TIC${ticket.ticketID.toString().padStart(4, '0')}`,
                    ticket.subject,
                    ticket.description,
                    ticket.isComplete ? 'Complete' : 'Incomplete',
                    new Date(ticket.date).toLocaleDateString(),
                    ticket.solution || 'Pending'
                ];
                tableRows.push(ticketData);
            });

            // Generate the table below the title and logo
            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: 50
            });

            doc.save('supportAgent_report.pdf');
        };
    };

    // Fetch tickets when the component loads
    useEffect(() => {
        fetchTickets();
        const interval = setInterval(() => {
            fetchTickets();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    // Filter tickets based on search term
    const filteredTickets = tickets.filter(ticket =>
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.email.toLowerCase().includes(searchTerm.toLowerCase()) 
    );

    return (
        <div className="flex flex-col" style={{width:'1200px'}}>
            <main className="flex-grow pt-16 px-4 md:px-8 lg:px-16">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <center><h1 className="text-2xl font-bold mb-4">All Tickets</h1></center>

                    <input 
                        type="text"
                        placeholder="Search by Subject, Description, or Email"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-4 px-4 py-2 border rounded-full w-full md:w-1/2"
                    />

                    <div className="flex space-x-4 mb-4">
                    
                        {/* Generate Excel Report button 
                        <button 
                            onClick={generateExcelReport}
                            className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition duration-300"
                        >
                            Generate Excel Report
                        </button>

                        */}

                        {/* Generate PDF Report button */}
                        <button 
                            onClick={generatePDFReport}
                            className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition duration-300"
                        >
                            Generate PDF Report
                        </button>
                    </div>

                    {/* Tickets table */}
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-center text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Ticket ID</th>
                                <th scope="col" className="px-6 py-3">Subject</th>
                                <th scope="col" className="px-6 py-3">Description</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">Created On</th>
                                <th scope="col" className="px-6 py-3">Solution</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTickets.map(ticket => (
                                <tr key={ticket._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                        {ticket.ticketID.toString().padStart(4, '0')}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                        {ticket.subject}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                        {ticket.description}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                        {ticket.email}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                        {new Date(ticket.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                        {ticket.solution || 'Pending'}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                        <div className="flex space-x-2">
                                            <button 
                                                onClick={() => editTicket(ticket._id)}
                                                className="bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600 transition duration-300"
                                            >
                                                Solution
                                            </button>
                                            <button 
                                                onClick={() => deleteTicket(ticket._id)}
                                                className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition duration-300"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}