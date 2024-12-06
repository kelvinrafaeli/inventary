import React from 'react';
import { Calendar, Shield } from 'lucide-react';
import { validateSystemLicense } from '../utils/systemLicense';

export const LicenseStatus: React.FC = () => {
  const storedLicense = localStorage.getItem('systemLicense');
  const { isValid, expirationDate } = validateSystemLicense(storedLicense || '');

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const getDaysRemaining = (date: Date | null) => {
    if (!date) return 0;
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysRemaining = expirationDate ? getDaysRemaining(expirationDate) : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className={isValid ? "text-green-500" : "text-red-500"} size={20} />
          <h2 className="text-lg font-medium text-gray-900">License Status</h2>
        </div>
        {isValid && (
          <span className="px-2.5 py-0.5 text-sm font-medium bg-green-100 text-green-800 rounded-full">
            Active
          </span>
        )}
      </div>
      
      <div className="mt-3 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500 flex items-center">
            <Calendar className="mr-1" size={16} />
            Expires
          </p>
          <p className="mt-1 text-sm font-medium text-gray-900">
            {formatDate(expirationDate)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Days Remaining</p>
          <p className={`mt-1 text-sm font-medium ${
            daysRemaining > 30 ? 'text-green-600' : 
            daysRemaining > 7 ? 'text-yellow-600' : 
            'text-red-600'
          }`}>
            {daysRemaining > 0 ? `${daysRemaining} days` : 'Expired'}
          </p>
        </div>
      </div>
    </div>
  );
};