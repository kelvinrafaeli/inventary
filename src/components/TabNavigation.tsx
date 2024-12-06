import React from 'react';
import { Barcode, LayoutGrid, Download, Key, CheckSquare } from 'lucide-react';
import { TabType } from '../types';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex justify-center overflow-x-auto">
      <div className="flex w-full max-w-md border-b border-gray-200">
        <button
          onClick={() => onTabChange('scan')}
          className={`flex-1 flex items-center justify-center px-3 py-2 text-sm ${
            activeTab === 'scan'
              ? 'text-red-600 border-b-2 border-red-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Barcode className="inline-block mr-1" size={16} />
          <span>Leitura</span>
        </button>
        <button
          onClick={() => onTabChange('check')}
          className={`flex-1 flex items-center justify-center px-3 py-2 text-sm ${
            activeTab === 'check'
              ? 'text-red-600 border-b-2 border-red-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <CheckSquare className="inline-block mr-1" size={16} />
          <span>Conferir</span>
        </button>
        <button
          onClick={() => onTabChange('summary')}
          className={`flex-1 flex items-center justify-center px-3 py-2 text-sm ${
            activeTab === 'summary'
              ? 'text-red-600 border-b-2 border-red-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <LayoutGrid className="inline-block mr-1" size={16} />
          <span>Resumo</span>
        </button>
        <button
          onClick={() => onTabChange('export')}
          className={`flex-1 flex items-center justify-center px-3 py-2 text-sm ${
            activeTab === 'export'
              ? 'text-red-600 border-b-2 border-red-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Download className="inline-block mr-1" size={16} />
          <span className="whitespace-nowrap">Importar/Exportar</span>
        </button>
        <button
          onClick={() => onTabChange('license')}
          className={`flex-1 flex items-center justify-center px-3 py-2 text-sm ${
            activeTab === 'license'
              ? 'text-red-600 border-b-2 border-red-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Key className="inline-block mr-1" size={16} />
          <span>Licença</span>
        </button>
      </div>
    </div>
  );
};