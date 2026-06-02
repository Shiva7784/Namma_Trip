/* eslint-disable react/prop-types */
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const WalletTransactions = ({ walletTransactions, handleDownloadWallet }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedType, setSelectedType] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5; // Adjust the number of transactions per page
  

  const transactionTypes = [
    'All',
    'Referral bonus',
    'Welcome bonus',
    'Purchase',
    'Credit',
    'Debit',
    'Top-up',
  ];

  const filteredTransactions = walletTransactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const withinDateRange =
      (!startDate || transactionDate >= startDate) &&
      (!endDate || transactionDate <= endDate);

    const typeMatch = selectedType === 'All' || transaction.type === selectedType;

    return withinDateRange && typeMatch;
  });

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
  
  const handleDownloadFilteredWallet = () => {
    handleDownloadWallet(filteredTransactions, startDate, endDate, selectedType);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const currentTransactions = filteredTransactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Wallet Transactions</h3>

      <p className="block mb-2">Filter Transactions</p>
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
        <label className="block mb-2">Transaction Type:</label>
        <select
          value={selectedType}
          onChange={e => setSelectedType(e.target.value)}
          className="p-2 border border-gray-300 rounded-md cursor-pointer"
        >
          {transactionTypes.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {currentTransactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentTransactions.map((transaction, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(transaction.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{transaction.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">INR {transaction.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-white text-center w-24 ${
                        transaction.status === 'Success' ? 'bg-green-400' : 'bg-red-400'
                      }`}
                    >
                      {transaction.status || 'Unknown'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No transactions found.</p>
      )}
      <button 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        onClick={handleDownloadFilteredWallet}
      >
        Download Wallet Transactions as PDF
      </button>

      <div className="flex justify-between items-center mt-4">
        <button 
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
        >
          Previous
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button 
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default WalletTransactions;
