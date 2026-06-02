/* eslint-disable react/prop-types */
const ConfirmModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-lg">
          <h3 className="text-lg mb-4">Are you sure you want to complete This action cannot be undone.</h3>
          <div className="flex justify-end">
            <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600">Cancel</button>
            <button onClick={onConfirm} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Confirm</button>
          </div>
        </div>
      </div>
    );
  };

  export default ConfirmModal;