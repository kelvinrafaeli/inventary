import React, { useState } from 'react';
import { Key, AlertCircle, X } from 'lucide-react';
import { validateSystemLicense } from '../utils/systemLicense';

interface LicenseValidationProps {
  onValidLicense: () => void;
  onClose: () => void;
}

export const LicenseValidation: React.FC<LicenseValidationProps> = ({
  onValidLicense,
  onClose,
}) => {
  const [licenseKey, setLicenseKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { isValid } = validateSystemLicense(licenseKey);
    
    if (isValid) {
      localStorage.setItem('systemLicense', licenseKey);
      onValidLicense();
    } else {
      setError('Licença inválida ou expirada');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="flex items-center justify-center mb-6">
          <Key className="text-red-600 mr-2" size={24} />
          <h2 className="text-xl font-bold text-gray-900">
            Validação de Licença
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
            <AlertCircle className="mr-2" size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="licenseKey" className="block text-sm font-medium text-gray-700 mb-1">
              Chave de Licença
            </label>
            <input
              type="text"
              id="licenseKey"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              placeholder="Digite sua chave de licença"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Validar Licença
          </button>
        </form>
      </div>
    </div>
  );
};