import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function DestinationAnalytics() {
    const [destinations, setDestinations] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const url=import.meta.env.BACKEND_URL;

    const fetchDestinations = async () => {
        try {
            const response = await axios.get(url+'/destination/');
            setDestinations(response.data);
            setFilteredData(response.data);
        } catch (error) {
            console.error('Error fetching destination analytics:', error);
        }
    };

    useEffect(() => {
        fetchDestinations();
    }, []);

    const generateExcelReport = () => {
        
        const wb = XLSX.utils.book_new();
        const wsData = destinations.map(destination => ({
            Title: destination.dTitle,
            Clicks: destination.clickCount,
        }));
        const ws = XLSX.utils.json_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, 'Destinations');

        
        XLSX.writeFile(wb, 'destinations_report.xlsx');
    };

    const generatePdfReport = () => {
        const doc = new jsPDF();

        
        const img = new Image();
        img.src = '/logo12.jpg'; 

        
        doc.addImage(img, 'jpg', (doc.internal.pageSize.getWidth() - 50) / 2, 10, 50, 20); // 50 is the width of the image

        
        doc.setFontSize(16);
        doc.text('Destination Report', doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });

        
        const tableColumn = ['Destination', 'Clicks'];
        const tableRows = destinations.map(destination => [destination.dTitle, destination.clickCount]);

        
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 50, 
            theme: 'grid',
            headStyles: {
                fillColor: [37, 99, 235], 
                textColor: [255, 255, 255], 
            },
        });

        doc.save('destinations_report.pdf');
    };

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow pt-16 px-4 md:px-8 lg:px-16">
                <center><h1 className="text-2xl font-bold mb-4">Destination Analytics</h1></center>

                <br />

                <div className="flex justify-center space-x-4 mb-4">
                    <button 
                        onClick={generateExcelReport}
                        className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition duration-300"
                    >
                        Generate Excel Report
                    </button>

                    <button 
                        onClick={generatePdfReport}
                        className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition duration-300"
                    >
                        Generate PDF Report
                    </button>
                </div>

                {/* Line Chart for clicks */}
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart
                        data={filteredData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="dTitle" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="clickCount" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>

            </main>
        </div>
    );
}
