import React, { useState } from 'react';
import { BarcodeSummary } from '../types';
import { BarChart, Edit2, Trash2, Save, X, Hash, Package } from 'lucide-react';
import { BarcodeSearch } from './BarcodeSearch';
import { getProductName } from '../utils/productUtils';

interface BarcodeSummaryProps {
  entries: BarcodeSummary[];
  onDelete?: (code: string) => void;
  onUpdateQuantity?: (code: string, newQuantity: number) => void;
}

export const BarcodeSummaryComponent: React.FC<BarcodeSummaryProps> = ({ 
  entries,
  onDelete,
  onUpdateQuantity
}) => {
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);

  const handleSearch = (code: string): BarcodeSummary | null => {
    return entries.find(entry => entry.originalCode === code) || null;
  };

  const handleEdit = (entry: BarcodeSummary) => {
    setEditingCode(entry.originalCode);
    setEditQuantity(entry.totalQuantity);
  };

  const handleSave = (code: string) => {
    if (editQuantity > 0 && onUpdateQuantity) {
      onUpdateQuantity(code, editQuantity);
      setEditingCode(null);
    }
  };

  const handleCancel = () => {
    setEditingCode(null);
  };

  // Calculate totals
  const totalCodes = entries.length;
  const totalQuantity = entries.reduce((sum, entry) => sum + entry.totalQuantity, 0);

  return (
    <div className="space-y-6">
      <BarcodeSearch 
        onSearch={handleSearch}
        onDelete={onDelete}
        onUpdateQuantity={onUpdateQuantity}
      />
      
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="flex items-center mb-4">
          <BarChart className="text-red-600 mr-2" size={24} />
          <h2 className="text-lg font-semibold">Resumo dos Códigos</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <Hash className="mr-2" size={16} />
              Total de Códigos
            </div>
            <p className="text-2xl font-semibold text-gray-900">{totalCodes}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <Package className="mr-2" size={16} />
              Quantidade Total
            </div>
            <p className="text-2xl font-semibold text-gray-900">{totalQuantity}</p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantidade Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ocorrências
                </th>
                {(onDelete || onUpdateQuantity) && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entries.map((entry) => (
                <tr key={entry.originalCode}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {entry.originalCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getProductName(entry.originalCode)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {editingCode === entry.originalCode ? (
                      <input
                        type="number"
                        min="1"
                        value={editQuantity}
                        onChange={(e) => setEditQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                      />
                    ) : (
                      entry.totalQuantity
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.occurrences}
                  </td>
                  {(onDelete || onUpdateQuantity) && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        {editingCode === entry.originalCode ? (
                          <>
                            <button
                              onClick={() => handleSave(entry.originalCode)}
                              className="text-green-600 hover:text-green-900"
                              title="Salvar"
                            >
                              <Save size={18} />
                            </button>
                            <button
                              onClick={handleCancel}
                              className="text-gray-600 hover:text-gray-900"
                              title="Cancelar"
                            >
                              <X size={18} />
                            </button>
                          </>
                        ) : (
                          <>
                            {onUpdateQuantity && (
                              <button
                                onClick={() => handleEdit(entry)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Editar quantidade"
                              >
                                <Edit2 size={18} />
                              </button>
                            )}
                            {onDelete && (
                              <button
                                onClick={() => onDelete(entry.originalCode)}
                                className="text-red-600 hover:text-red-900"
                                title="Excluir"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};