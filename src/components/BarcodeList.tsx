import React, { useState } from 'react';
import { Trash2, Edit2, Save, X } from 'lucide-react';
import { BarcodeEntry } from '../types';
import { getProductName } from '../utils/productUtils';

interface BarcodeListProps {
  entries: BarcodeEntry[];
  onDelete: (id: string) => void;
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  showAll?: boolean;
  showProduct?: boolean;
}

export const BarcodeList: React.FC<BarcodeListProps> = ({ 
  entries, 
  onDelete,
  onUpdateQuantity,
  showAll = false,
  showProduct = false
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);

  const handleEdit = (entry: BarcodeEntry) => {
    setEditingId(entry.id);
    setEditQuantity(entry.quantity);
  };

  const handleSave = (id: string) => {
    if (editQuantity > 0) {
      onUpdateQuantity(id, editQuantity);
    }
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const displayEntries = showAll ? entries : entries.slice(-5).reverse();

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">
        {showAll ? 'Todos os Códigos' : 'Últimas Leituras'}
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código
              </th>
              {showProduct && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produto
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantidade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayEntries.map((entry) => (
              <tr key={entry.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {entry.code}
                </td>
                {showProduct && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getProductName(entry.code)}
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {editingId === entry.id ? (
                    <input
                      type="number"
                      min="1"
                      value={editQuantity}
                      onChange={(e) => setEditQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                    />
                  ) : (
                    entry.quantity
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    {editingId === entry.id ? (
                      <>
                        <button
                          onClick={() => handleSave(entry.id)}
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
                        <button
                          onClick={() => handleEdit(entry)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar quantidade"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => onDelete(entry.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};