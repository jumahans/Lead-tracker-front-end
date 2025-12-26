import { useState } from 'react';
import { businessAPI } from '../services/api';

const CallStatusDropdown = ({ leadId, currentStatus, onStatusUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notes, setNotes] = useState('');

  const statusOptions = [
    { value: 'not_called', label: 'Not Called', color: 'bg-gray-100 text-gray-700' },
    { value: 'called', label: 'Called', color: 'bg-blue-100 text-blue-700' },
    { value: 'interested', label: 'Interested', color: 'bg-green-100 text-green-700' },
    { value: 'not_interested', label: 'Not Interested', color: 'bg-red-100 text-red-700' }
  ];

  const currentStatusObj = statusOptions.find(s => s.value === currentStatus);

  const handleStatusUpdate = async (status) => {
    setIsUpdating(true);
    try {
      await businessAPI.updateCallStatus(leadId, { status, notes });
      onStatusUpdate(leadId, status, notes);
      setIsOpen(false);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md ${currentStatusObj?.color}`}
      >
        {currentStatusObj?.label}
        <svg className="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
          <div className="p-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this lead..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
              />
            </div>
            <div className="space-y-2">
              {statusOptions.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleStatusUpdate(status.value)}
                  disabled={isUpdating}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-gray-50 ${status.color} ${
                    currentStatus === status.value ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallStatusDropdown;


