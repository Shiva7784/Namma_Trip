/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ConfirmModal from "../Confirm";
import Spinner from "../../../components/spinner/spinner";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTransaction, setNewTransaction] = useState({ amount: '', type: 'Credit', status: 'Success', userId: '' });
  const [selectedType, setSelectedType] = useState('All');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(5);
  const [deleteTransactionId, setDeleteTransactionId] = useState(null);
  const [currentWalletId, setCurrentWalletId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const url=import.meta.env.BACKEND_URL;

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(url+'/api/transaction/');
      const allTransactions = response.data.flatMap(user => 
        user.transactionHistory.map(transaction => ({
          ...transaction, 
          userName: user.userName, 
          walletId: user._id
        }))
      );
      setTransactions(allTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to fetch transactions.");
    } finally {
      setLoading(false);
    }
  };

  const toggleTransactionStatus = async (transaction) => {
    const updatedStatus = transaction.status === 'Success' ? 'Failed' : 'Success';
    const updatedTransaction = { ...transaction, status: updatedStatus };

    try {
      await axios.patch(url+`/api/transaction/${transaction.walletId}/transaction/${transaction._id}`, { status: updatedStatus });
      setTransactions(prevTransactions => prevTransactions.map(t => t._id === transaction._id ? updatedTransaction : t));
      toast.success(`Transaction status updated to ${updatedStatus}.`);
    } catch (error) {
      console.error("Error updating transaction status:", error);
      toast.error("Failed to update transaction status.");
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(url+'/api/transaction/add-transaction', newTransaction);
      setTransactions(prev => [...prev, response.data]);
      toast.success("Transaction added successfully.");
      setNewTransaction({ amount: '', type: 'Credit', status: 'Success', userId: '' }); 
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast.error("Failed to add transaction.");
    }
  };

  const handleDeleteTransaction = async () => {
    if (deleteTransactionId && currentWalletId) {
      try {
        await axios.delete(url+`/api/transaction/${currentWalletId}/transaction/${deleteTransactionId}`);
        setTransactions(prev => prev.filter(t => t._id !== deleteTransactionId)); 
        toast.success("Transaction deleted successfully.");
      } catch (error) {
        console.error("Error deleting transaction:", error);
        toast.error("Failed to delete transaction.");
      }
      // Reset modal state
      setDeleteTransactionId(null);
      setCurrentWalletId(null);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const withinDateRange = (
      (!startDate || new Date(transaction.date) >= startDate) &&
      (!endDate || new Date(transaction.date) <= endDate)
    );
    const matchesType = selectedType === 'All' || transaction.type === selectedType;
    const matchesSearchTerm = transaction.userName.toLowerCase().includes(searchTerm.toLowerCase());
    return withinDateRange && matchesType && matchesSearchTerm;
  });

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const totalBalance = transactions.reduce((total, transaction) => {
    return transaction.type === 'Credit' ? total + transaction.amount : total - transaction.amount;
  }, 0);
  

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Manage Transactions</h2>
      <h3 className="text-lg mb-4 bg-blue-500 p-4 rounded w-52 text-white">Total Transactions: INR {totalBalance.toFixed(2)}</h3>

      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center">
          <label className="mr-4">Transaction Type:</label>
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="p-2 border border-gray-300 rounded-md cursor-pointer"
          >
            <option value="All">All</option>
            <option value="Credit">Credit</option>
            <option value="Debit">Debit</option>
            <option value="Referral bonus">Referral bonus</option>
            <option value="Welcome bonus">Welcome bonus</option>
            <option value="Purchase">Purchase</option>
            <option value="Top-up">Top-Up</option>
          </select>
        </div>

        <div className="flex items-center">
          <p className="mr-4">Filter by Dates:</p>
          <div className="flex space-x-4">
            <DatePicker
              selected={startDate}
              onChange={date => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Start Date"
              className="p-2 border border-gray-300 rounded-md w-full cursor-pointer"
            />
            <p className="flex items-center">to</p>
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
        </div>
      </div>

      <p className="block mb-2">Search by Name</p>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Enter user's name to search"
        className="border p-2 rounded mb-4 w-full"
      />

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">User Name</th>
            <th className="border px-4 py-2">Type</th>
            <th className="border px-4 py-2">Amount</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentTransactions.length > 0 ? (
            currentTransactions.map(transaction => (
              <tr key={transaction._id}>
                <td className="border px-4 py-2">{new Date(transaction.date).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{transaction.userName}</td>
                <td className="border px-4 py-2">{transaction.type}</td>
                <td className="border px-4 py-2">INR {transaction.amount}</td>
                <td className="border px-4 py-2">
                  <button 
                    onClick={() => toggleTransactionStatus(transaction)} 
                    className={`px-2 py-1 rounded ${transaction.status === 'Failed' ? 'bg-red-500 text-white w-24 hover:bg-red-600 rounded-full' : 'bg-green-500 text-white w-24 hover:bg-green-600 rounded-full'}`}
                  >
                    {transaction.status === 'Failed' ? 'Failed' : 'Success'}
                  </button>
                </td>
                <td className="border px-4 py-2">
                  <button 
                    onClick={() => {
                      setDeleteTransactionId(transaction._id);
                      setCurrentWalletId(transaction.walletId);
                    }} 
                    className="bg-red-500 text-white px-2 py-1 rounded w-24 hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="border px-4 py-2 text-center">No transactions found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mt-4">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="mr-2 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400" 
        >
          Previous
        </button>
        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredTransactions.length / transactionsPerPage)))}
          disabled={currentPage === Math.ceil(filteredTransactions.length / transactionsPerPage)}
          className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
        >
          Next
        </button>
      </div>

      <ConfirmModal
        isOpen={deleteTransactionId !== null}
        onClose={() => {
          setDeleteTransactionId(null);
          setCurrentWalletId(null);
        }}
        onConfirm={handleDeleteTransaction}
      />
    </div>
  );
};

export default Transactions;
