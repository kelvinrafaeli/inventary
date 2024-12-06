import React from 'react';
import { List, Plus } from 'lucide-react';
import { AdminTabType } from '../../types';

interface AdminTabsProps {
  activeTab: AdminTabType;
  onTabChange: (tab: AdminTabType) => void;
}

export const AdminTabs: React.FC<AdminTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex space-x-4 mt-4">
      <button
        onClick={() => onTabChange('licenses')}
        className={`flex items-center px-4 py-2 rounded-md ${
          activeTab === 'licenses'
            ? 'bg-red-600 text-white'
            : 'bg-white text-gray-600 hover:bg-gray-50'
        }`}
      >
        <List className="mr-2" size={18} />
        Licenças
      </button>
      <button
        onClick={() => onTabChange('generate')}
        className={`flex items-center px-4 py-2 rounded-md ${
          activeTab === 'generate'
            ? 'bg-red-600 text-white'
            : 'bg-white text-gray-600 hover:bg-gray-50'
        }`}
      >
        <Plus className="mr-2" size={18} />
        Gerar Licença
      </button>
    </div>
  );
};