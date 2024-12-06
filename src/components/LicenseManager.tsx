import React, { useState } from 'react';
import { Key, ShieldCheck, ShieldX, RefreshCw } from 'lucide-react';
import { validateSystemLicense, clearAllStorage } from '../utils/systemLicense';

interface LicenseManagerProps {
  onValidLicense: (isAdmin: boolean) => void;
}

export const LicenseManager: React.FC<LicenseManagerProps> = ({ onValidLicense }) => {
  const [licenseKey, setLicenseKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { isValid, expirationDate, isAdmin } = validateSystemLicense(licenseKey);
    
    if (isValid && expirationDate) {
      onValidLicense(isAdmin);
      localStorage.setItem('systemLicense', licenseKey);
    } else {
      setError('Chave de licença inválida ou expirada');
    }
  };

  const handleClearCache = () => {
    if (window.confirm('Isso irá limpar todos os dados armazenados. Deseja continuar?')) {
      clearAllStorage();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <Key className="text-red-600 mr-2" size={32} />
          <h1 className="text-2xl font-bold text-gray-900">Licença do Sistema</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
            <ShieldX className="mr-2" size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="licenseKey" className="block text-sm font-medium text-gray-700">
              Chave de Licença
            </label>
            <input
              id="licenseKey"
              type="text"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              placeholder="Digite sua chave de licença"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <ShieldCheck className="mr-2" size={18} />
            Ativar Licença
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={handleClearCache}
            className="w-full flex items-center justify-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <RefreshCw className="mr-2" size={18} />
            Limpar Cache
          </button>
        </div>
      </div>
    </div>
  );
};