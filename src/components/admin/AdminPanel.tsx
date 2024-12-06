import React, { useState, useEffect } from 'react';
import { Shield, LogOut } from 'lucide-react';
import { AdminLicenseList } from './AdminLicenseList';
import { GenerateLicense } from './GenerateLicense';
import { AdminTabType, SystemLicense } from '../../types';
import { AdminTabs } from './AdminTabs';

const LICENSES_STORAGE_KEY = 'adminLicenses';

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTabType>('licenses');
  const [licenses, setLicenses] = useState<SystemLicense[]>([]);

  useEffect(() => {
    const storedLicenses = localStorage.getItem(LICENSES_STORAGE_KEY);
    if (storedLicenses) {
      try {
        const parsedLicenses = JSON.parse(storedLicenses);
        setLicenses(parsedLicenses.map((license: any) => ({
          ...license,
          expirationDate: new Date(license.expirationDate),
          createdAt: new Date(license.createdAt)
        })));
      } catch (error) {
        console.error('Error loading licenses:', error);
      }
    }
  }, []);

  const saveLicenses = (updatedLicenses: SystemLicense[]) => {
    try {
      localStorage.setItem(LICENSES_STORAGE_KEY, JSON.stringify(updatedLicenses));
      setLicenses(updatedLicenses);
    } catch (error) {
      console.error('Error saving licenses:', error);
    }
  };

  const handleAddLicense = (license: SystemLicense) => {
    saveLicenses([...licenses, license]);
  };

  const handleDeleteLicense = (id: string) => {
    saveLicenses(licenses.filter(license => license.id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem('systemLicense');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="text-red-600" size={24} />
              <h1 className="text-2xl font-bold text-gray-900">
                Painel Administrativo
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 focus:outline-none"
              title="Sair do painel administrativo"
            >
              <LogOut size={20} className="mr-2" />
              Sair
            </button>
          </div>
          <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'licenses' ? (
          <AdminLicenseList 
            licenses={licenses} 
            onDeleteLicense={handleDeleteLicense} 
          />
        ) : (
          <GenerateLicense onLicenseGenerated={handleAddLicense} />
        )}
      </main>
    </div>
  );
};