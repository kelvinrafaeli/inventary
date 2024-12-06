import React from 'react';
import { Header } from './Header';
import { TabType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onAdminClick: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  onTabChange,
  onAdminClick 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header activeTab={activeTab} onTabChange={onTabChange} />
      <main className="flex-1 w-full px-4 py-4">
        {children}
      </main>
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col items-center">
            <button
              onClick={onAdminClick}
              className="w-full max-w-sm px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Painel Administrativo
            </button>
            <p className="mt-4 text-center text-xs text-gray-600">
              © {new Date().getFullYear()} Ganzer Automação. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};