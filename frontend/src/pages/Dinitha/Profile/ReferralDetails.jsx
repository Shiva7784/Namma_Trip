/* eslint-disable react/prop-types */
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ReferralDetails = ({ referralLogs, userData, shareReferralCode, handleDownloadReferral }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 5; // Adjust the number of logs per page

  const filteredLogs = referralLogs.filter(log => {
    const logDate = new Date(log.date);
    const withinDateRange =
      (!startDate || logDate >= startDate) &&
      (!endDate || logDate <= endDate);

    const usernameMatch = log.referredUserName.toLowerCase().includes(searchTerm.toLowerCase());

    return withinDateRange && usernameMatch;
  });

  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  
  const currentLogs = filteredLogs.slice(
    (currentPage - 1) * logsPerPage,
    currentPage * logsPerPage
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Referral Details</h3>
      <p className="mb-4 text-lg font-semibold">Invite Your Friends and Earn Incentives for successful referrals</p>
      <p className="mb-4 text-xl font-bold">
        Your Referral Code: <span className="text-blue-600">{userData.referralCode || 'Not generated yet'}</span>
      </p>
      <button 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        onClick={shareReferralCode}
      >
        Copy Referral Link
      </button>

      <p className="block mb-2 mt-5">Filter Referrals</p>
      <div className="flex space-x-4 mb-4">
        <DatePicker
          selected={startDate}
          onChange={date => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Start Date"
          className="p-2 border border-gray-300 rounded-md w-full cursor-pointer"
        />
        <p className="block mb-2">to</p>
        <DatePicker
          selected={endDate}
          onChange={date => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          placeholderText="End Date"
          className="p-2 border border-gray-300 rounded-md w-full cursor-pointer"
        />
      </div>

      <div className="mb-4">
        <p className="block mb-2">Search by Username</p>
        <input
          type="text"
          placeholder="Enter Username"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mt-6">
        {currentLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referred User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentLogs.map((log, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(log.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{log.referredUserName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-white text-center w-28 ${
                          log.status === 'Success' ? 'bg-green-400' : 'bg-red-400'
                        }`}
                      >
                        {log.status || 'Unknown'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No referral logs found.</p>
        )}
      </div>
      <button 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        onClick={handleDownloadReferral}
      >
        Download Referral Logs as PDF
      </button>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button 
          onClick={() => setCurrentPage(currentPage - 1)} 
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
        >
          Previous
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button 
          onClick={() => setCurrentPage(currentPage + 1)} 
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ReferralDetails;
