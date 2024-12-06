import React, { useState } from 'react';
import { AlertCircle, CheckCircle, XCircle, FileText } from 'lucide-react';
import { BarcodeEntry, ProductReference } from '../types';
import { normalizeBarcode } from '../utils/productUtils';

interface DivergenceReportProps {
  entries: BarcodeEntry[];
  delimiter: string;
}

interface DivergenceItem {
  code: string;
  name: string;
  expectedQuantity: number;
  actualQuantity: number;
  difference: number;
}

export const DivergenceReport: React.FC<DivergenceReportProps> = ({
  entries,
  delimiter
}) => {
  const [exportFormat, setExportFormat] = useState<'txt' | 'csv'>('txt');

  const generateDivergenceReport = (): DivergenceItem[] => {
    try {
      const importedProducts = JSON.parse(localStorage.getItem('importedProducts') || '[]') as ProductReference[];
      if (!importedProducts.length) return [];

      // Create a map of actual quantities from entries
      const actualQuantities = new Map<string, number>();
      entries.forEach(entry => {
        const normalizedCode = normalizeBarcode(entry.code);
        actualQuantities.set(
          normalizedCode,
          (actualQuantities.get(normalizedCode) || 0) + entry.quantity
        );
      });

      // Compare with expected quantities
      return importedProducts
        .map(product => {
          const normalizedCode = normalizeBarcode(product.code);
          const actualQty = actualQuantities.get(normalizedCode) || 0;
          const expectedQty = product.quantity || 0;
          
          return {
            code: product.code,
            name: product.name,
            expectedQuantity: expectedQty,
            actualQuantity: actualQty,
            difference: actualQty - expectedQty
          };
        })
        .filter(item => item.expectedQuantity > 0 || item.actualQuantity > 0);
    } catch {
      return [];
    }
  };

  const exportDivergences = () => {
    const divergences = generateDivergenceReport();
    const headers = `Código${delimiter}Produto${delimiter}Qtd. Esperada${delimiter}Qtd. Lida${delimiter}Diferença\n`;
    const content = divergences
      .map(d => `${d.code}${delimiter}${d.name}${delimiter}${d.expectedQuantity}${delimiter}${d.actualQuantity}${delimiter}${d.difference}`)
      .join('\n');

    // Add BOM for UTF-8
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + headers + content], { 
      type: exportFormat === 'csv' ? 'text/csv;charset=utf-8' : 'text/plain;charset=utf-8'
    });
    
    const now = new Date();
    const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `divergencias_${timestamp}.${exportFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const divergences = generateDivergenceReport();
  if (!divergences.length) {
    return null;
  }

  const totalExpected = divergences.reduce((sum, item) => sum + item.expectedQuantity, 0);
  const totalActual = divergences.reduce((sum, item) => sum + item.actualQuantity, 0);
  const totalDifference = totalActual - totalExpected;

  return (
    <div className="bg-white p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Relatório de Divergências</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                checked={exportFormat === 'txt'}
                onChange={() => setExportFormat('txt')}
                className="form-radio h-4 w-4 text-red-600"
              />
              <span className="text-sm">.txt</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                checked={exportFormat === 'csv'}
                onChange={() => setExportFormat('csv')}
                className="form-radio h-4 w-4 text-red-600"
              />
              <span className="text-sm">.csv</span>
            </label>
          </div>
          <button
            onClick={exportDivergences}
            className="flex items-center px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <FileText className="mr-2" size={18} />
            Exportar Divergências
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-600 mb-1">Quantidade Esperada</p>
          <p className="text-2xl font-semibold text-blue-700">{totalExpected}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-600 mb-1">Quantidade Lida</p>
          <p className="text-2xl font-semibold text-green-700">{totalActual}</p>
        </div>
        <div className={`p-4 rounded-lg ${totalDifference === 0 ? 'bg-gray-50' : totalDifference > 0 ? 'bg-yellow-50' : 'bg-red-50'}`}>
          <p className={`text-sm mb-1 ${totalDifference === 0 ? 'text-gray-600' : totalDifference > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
            Diferença Total
          </p>
          <p className={`text-2xl font-semibold ${totalDifference === 0 ? 'text-gray-700' : totalDifference > 0 ? 'text-yellow-700' : 'text-red-700'}`}>
            {totalDifference > 0 ? `+${totalDifference}` : totalDifference}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produto
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Qtd. Esperada
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Qtd. Lida
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Diferença
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {divergences.map((item) => (
              <tr key={item.code}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.expectedQuantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.actualQuantity}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  item.difference === 0 ? 'text-gray-500' :
                  item.difference > 0 ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {item.difference > 0 ? `+${item.difference}` : item.difference}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {item.difference === 0 ? (
                    <CheckCircle className="text-green-500" size={18} />
                  ) : (
                    <XCircle className="text-red-500" size={18} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};