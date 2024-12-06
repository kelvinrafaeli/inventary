import React, { useState } from 'react';
import { Shield, Calendar, AlertCircle, Key, RefreshCw } from 'lucide-react';
import { validateSystemLicense } from '../utils/systemLicense';
import { LicenseValidation } from './LicenseValidation';

export const LicenseTab: React.FC = () => {
  const [showLicenseValidation, setShowLicenseValidation] = useState(false);
  const storedLicense = localStorage.getItem('systemLicense');
  const { isValid, expirationDate } = validateSystemLicense(storedLicense || '');

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('pt-BR', {
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

  const handleClearCache = () => {
    if (window.confirm('Tem certeza que deseja limpar todos os dados? Esta ação irá remover a licença, leituras e todas as configurações do sistema. Esta ação não pode ser desfeita.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const daysRemaining = expirationDate ? getDaysRemaining(expirationDate) : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Shield className={isValid ? "text-green-500" : "text-red-500"} size={24} />
            <h2 className="text-xl font-semibold text-gray-900">Status da Licença</h2>
          </div>
          {!isValid && (
            <button
              onClick={() => setShowLicenseValidation(true)}
              className="flex items-center px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <Key className="mr-2" size={18} />
              Ativar Licença
            </button>
          )}
          {isValid && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Ativa
            </span>
          )}
        </div>

        {!isValid && !showLicenseValidation && (
          <div className="flex items-start space-x-3 p-4 bg-amber-50 text-amber-700 rounded-lg mb-6">
            <AlertCircle className="flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-medium">Sistema sem licença ativa</p>
              <p className="mt-1 text-sm">
                Para utilizar recursos avançados como exportação de dados, é necessário ativar uma licença válida.
              </p>
            </div>
          </div>
        )}

        {isValid && (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <Calendar className="mr-2" size={16} />
                Data de Expiração
              </div>
              <p className="text-lg font-medium text-gray-900">
                {formatDate(expirationDate)}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Tempo Restante</div>
              <p className={`text-lg font-medium ${
                daysRemaining > 30 ? 'text-green-600' : 
                daysRemaining > 7 ? 'text-yellow-600' : 
                'text-red-600'
              }`}>
                {daysRemaining > 0 ? `${daysRemaining} dias` : 'Expirada'}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Limpar Cache</h3>
            <p className="mt-1 text-sm text-gray-500">
              Remove todos os dados armazenados, incluindo licença, leituras e configurações
            </p>
          </div>
          <button
            onClick={handleClearCache}
            className="flex items-center px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <RefreshCw className="mr-2" size={18} />
            Limpar Cache
          </button>
        </div>
      </div>

      {showLicenseValidation && (
        <LicenseValidation
          onValidLicense={() => {
            setShowLicenseValidation(false);
            window.location.reload();
          }}
          onClose={() => setShowLicenseValidation(false)}
        />
      )}
    </div>
  );
};