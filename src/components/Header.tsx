import React from 'react';
import { Barcode, Shield } from 'lucide-react';
import { TabNavigation } from './TabNavigation';
import { TabType } from '../types';
import { validateSystemLicense } from '../utils/systemLicense';

interface HeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const storedLicense = localStorage.getItem('systemLicense');
  const { isValid } = validateSystemLicense(storedLicense || '');

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-2">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Barcode className="text-red-600" size={20} />
              <h1 className="text-lg font-bold text-gray-900">
                Ganzer Automação
              </h1>
            </div>
            <div className="flex items-center">
              <Shield className={isValid ? "text-green-500" : "text-gray-400"} size={16} />
              <span className={`ml-1 text-xs ${isValid ? "text-green-600" : "text-gray-500"}`}>
                {isValid ? "Licença Ativa" : "Sem Licença"}
              </span>
            </div>
          </div>
          <TabNavigation activeTab={activeTab} onTabChange={onTabChange} />
        </div>
      </div>
    </header>
  );
};