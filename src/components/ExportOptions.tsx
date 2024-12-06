import React from 'react';
import { Download } from 'lucide-react';
import { ExportOptions } from '../types';
import { getExportFilename } from '../utils/licenseGenerator';

interface ExportOptionsProps {
  options: ExportOptions;
  onOptionsChange: (options: ExportOptions) => void;
  onExport: () => void;
}

export const ExportOptionsComponent: React.FC<ExportOptionsProps> = ({
  options,
  onOptionsChange,
  onExport,
}) => {
  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Export Options</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Delimiter</label>
          <div className="mt-1 flex space-x-4">
            {[',', ';', '.'].map((d) => (
              <label key={d} className="inline-flex items-center">
                <input
                  type="radio"
                  checked={options.delimiter === d}
                  onChange={() => onOptionsChange({ ...options, delimiter: d })}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">{d}</span>
              </label>
            ))}
            <input
              type="text"
              value={![',', ';', '.'].includes(options.delimiter) ? options.delimiter : ''}
              onChange={(e) => onOptionsChange({ ...options, delimiter: e.target.value })}
              placeholder="Custom"
              className="w-24 px-2 py-1 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Format</label>
          <div className="mt-1 flex space-x-4">
            {['txt', 'csv'].map((format) => (
              <label key={format} className="inline-flex items-center">
                <input
                  type="radio"
                  checked={options.format === format}
                  onChange={() => onOptionsChange({ ...options, format: format as 'txt' | 'csv' })}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">.{format}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={onExport}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          <Download size={18} className="mr-2" />
          Export
        </button>
      </div>
    </div>
  );
};