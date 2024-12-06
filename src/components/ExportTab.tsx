import React, { useState } from 'react';
import { Download, AlertCircle, Key, Upload } from 'lucide-react';
import { ExportOptions, BarcodeEntry } from '../types';
import { validateSystemLicense } from '../utils/systemLicense';
import { LicenseValidation } from './LicenseValidation';
import { DivergenceReport } from './DivergenceReport';

interface ExportTabProps {
  options: ExportOptions;
  onOptionsChange: (options: ExportOptions) => void;
  onExport: () => void;
  entries: BarcodeEntry[];
}

export const ExportTab: React.FC<ExportTabProps> = ({
  options,
  onOptionsChange,
  onExport,
  entries
}) => {
  const [showLicenseValidation, setShowLicenseValidation] = useState(false);
  const [includeQuantity, setIncludeQuantity] = useState(false);
  const storedLicense = localStorage.getItem('systemLicense');
  const { isValid } = validateSystemLicense(storedLicense || '');

  const handleExportClick = () => {
    if (!isValid) {
      setShowLicenseValidation(true);
    } else {
      onExport();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const lines = content.split('\n').filter(line => line.trim());
        
        const products = lines.map(line => {
          const parts = line.split(options.delimiter).map(part => part.trim());
          if (includeQuantity && parts.length >= 3) {
            return {
              code: parts[0],
              name: parts[1],
              quantity: parseInt(parts[2]) || 0
            };
          }
          return {
            code: parts[0],
            name: parts[1] || '-'
          };
        });

        if (products.length === 0) {
          throw new Error('Nenhum produto encontrado no arquivo');
        }

        localStorage.setItem('importedProducts', JSON.stringify(products));
        localStorage.removeItem('scannedCodes'); // Reset scanned codes when importing new products
        alert(`${products.length} produtos importados com sucesso!`);
      } catch (error) {
        alert('Erro ao processar o arquivo. Verifique o formato e tente novamente.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-6">Exportar Dados</h2>
        
        {!isValid && (
          <div className="mb-6 flex items-center p-4 text-amber-700 bg-amber-50 rounded-lg">
            <AlertCircle className="mr-2 flex-shrink-0" size={20} />
            <div className="flex-1">
              <p className="font-medium">Licença necessária para exportar</p>
              <p className="text-sm mt-1">
                Você precisa de uma licença válida para exportar os dados.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delimitador
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[',', ';', '.'].map((d) => (
                <label key={d} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={options.delimiter === d}
                    onChange={() => onOptionsChange({ ...options, delimiter: d })}
                    className="form-radio h-4 w-4 text-red-600"
                  />
                  <span>{d}</span>
                </label>
              ))}
              <div className="col-span-2 sm:col-span-1">
                <input
                  type="text"
                  value={![',', ';', '.'].includes(options.delimiter) ? options.delimiter : ''}
                  onChange={(e) => onOptionsChange({ ...options, delimiter: e.target.value })}
                  placeholder="Personalizado"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formato do Arquivo
            </label>
            <div className="grid grid-cols-2 gap-4">
              {['txt', 'csv'].map((format) => (
                <label key={format} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={options.format === format}
                    onChange={() => onOptionsChange({ ...options, format: format as 'txt' | 'csv' })}
                    className="form-radio h-4 w-4 text-red-600"
                  />
                  <span>.{format}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantidade de Dígitos (Quantidade)
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={options.quantityPadding}
              onChange={(e) => onOptionsChange({ ...options, quantityPadding: parseInt(e.target.value) || 0 })}
              className="w-24 px-3 py-1.5 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Ex: Para 4 dígitos, 25 será exportado como 0025
            </p>
          </div>

          <button
            onClick={handleExportClick}
            className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            {isValid ? (
              <>
                <Download size={18} className="mr-2" />
                Exportar Dados
              </>
            ) : (
              <>
                <Key size={18} className="mr-2" />
                Validar Licença para Exportar
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-6">Importar Produtos</h2>
        <div className="space-y-4">
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-4">
              <input
                type="checkbox"
                checked={includeQuantity}
                onChange={(e) => setIncludeQuantity(e.target.checked)}
                className="form-checkbox h-4 w-4 text-red-600 rounded"
              />
              <span>Arquivo inclui quantidade esperada</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Arquivo de Produtos
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-gray-500 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-50">
                <Upload className="mx-auto mb-2" size={24} />
                <span className="text-sm text-center">
                  Clique para selecionar ou arraste o arquivo
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept=".txt,.csv"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Formato: código{options.delimiter}nome do produto{includeQuantity ? `${options.delimiter}quantidade` : ''}
            </p>
          </div>
        </div>
      </div>

      <DivergenceReport 
        entries={entries}
        delimiter={options.delimiter}
      />

      {showLicenseValidation && (
        <LicenseValidation
          onValidLicense={() => {
            setShowLicenseValidation(false);
            onExport();
          }}
          onClose={() => setShowLicenseValidation(false)}
        />
      )}
    </div>
  );
};