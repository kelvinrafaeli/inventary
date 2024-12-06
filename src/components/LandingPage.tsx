import React, { useState } from 'react';
import { Barcode, Shield, AlertCircle } from 'lucide-react';

interface LandingPageProps {
  onInventoryAccess: () => void;
  onAdminAccess: (needsLicense: boolean) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onInventoryAccess, 
  onAdminAccess 
}) => {
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');
  const [showAdminInput, setShowAdminInput] = useState(false);

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'inventarioganzer') {
      onAdminAccess(true); // Pass true to indicate we need to show license manager
    } else {
      setError('Senha incorreta');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Barcode className="text-red-600" size={48} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ganzer Automação
          </h1>
          <p className="text-gray-600">
            Sistema de Inventário
          </p>
        </div>

        {!showAdminInput ? (
          <div className="space-y-4">
            <button
              onClick={onInventoryAccess}
              className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <Barcode className="mr-2" size={20} />
              Inventário Padrão
            </button>
            
            <button
              onClick={() => setShowAdminInput(true)}
              className="w-full flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <Shield className="mr-2" size={20} />
              Painel Administrativo
            </button>
          </div>
        ) : (
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center p-3 text-sm text-red-600 bg-red-50 rounded-md">
                <AlertCircle className="mr-2" size={16} />
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha Administrativa
              </label>
              <input
                type="password"
                id="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                placeholder="Digite a senha"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowAdminInput(false);
                  setError('');
                  setAdminPassword('');
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Acessar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};