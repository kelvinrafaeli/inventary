import React from 'react';
import { Trash2, Calendar, Clock, Copy } from 'lucide-react';
import { SystemLicense } from '../../types';

interface AdminLicenseListProps {
  licenses: SystemLicense[];
  onDeleteLicense: (id: string) => void;
}

export const AdminLicenseList: React.FC<AdminLicenseListProps> = ({
  licenses,
  onDeleteLicense,
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(date));
  };

  const isExpired = (date: Date) => {
    return new Date(date) < new Date();
  };

  const getDurationAndRemaining = (createdAt: Date, expirationDate: Date) => {
    const totalDuration = Math.ceil(
      (expirationDate.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    const remaining = Math.ceil(
      (expirationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      duration: totalDuration,
      remaining: Math.max(0, remaining)
    };
  };

  const handleDelete = (id: string, clientName: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a licença de ${clientName}? O cliente perderá acesso imediatamente.`)) {
      onDeleteLicense(id);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Chave copiada para a área de transferência!');
    }).catch(err => {
      console.error('Erro ao copiar:', err);
    });
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-lg font-medium text-gray-900">Licenças</h2>
        <p className="mt-1 text-sm text-gray-500">
          Lista de todas as licenças geradas
        </p>
      </div>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Cliente
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chave
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Duração
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Tempo Restante
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {licenses.map((license) => {
                const { duration, remaining } = getDurationAndRemaining(
                  new Date(license.createdAt),
                  new Date(license.expirationDate)
                );
                
                return (
                  <tr key={license.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {license.clientName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center group">
                        <div className="font-mono text-xs break-all max-w-md">
                          {license.key}
                        </div>
                        <button
                          onClick={() => copyToClipboard(license.key)}
                          className="ml-2 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Copiar chave"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="mr-2" size={16} />
                        {duration} dias
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="mr-2" size={16} />
                        {remaining > 0 ? (
                          <span className={`${
                            remaining <= 7 ? 'text-red-600' : 
                            remaining <= 30 ? 'text-yellow-600' : 
                            'text-green-600'
                          }`}>
                            {remaining} dias
                          </span>
                        ) : (
                          <span className="text-red-600">Expirada</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        isExpired(license.expirationDate)
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {isExpired(license.expirationDate) ? 'Expirada' : 'Ativa'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(license.id, license.clientName)}
                        className="text-red-600 hover:text-red-900"
                        title="Excluir licença"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};