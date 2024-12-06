import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { SystemLicense } from '../../types';
import { generateSystemLicense } from '../../utils/systemLicense';

interface GenerateLicenseProps {
  onLicenseGenerated: (license: SystemLicense) => void;
}

export const GenerateLicense: React.FC<GenerateLicenseProps> = ({
  onLicenseGenerated,
}) => {
  const [clientName, setClientName] = useState('');
  const [days, setDays] = useState(30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const licenseKey = generateSystemLicense(days);
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);

    const newLicense: SystemLicense = {
      id: uuidv4(),
      key: licenseKey,
      clientName,
      expirationDate,
      isValid: true,
      createdAt: new Date(),
    };

    onLicenseGenerated(newLicense);
    setClientName('');
    setDays(30);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">
          Gerar Nova Licença
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">
              Nome do Cliente
            </label>
            <input
              type="text"
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label htmlFor="days" className="block text-sm font-medium text-gray-700">
              Duração da Licença (dias)
            </label>
            <input
              type="number"
              id="days"
              value={days}
              onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 1))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              min="1"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Gerar Licença
          </button>
        </form>
      </div>
    </div>
  );
};