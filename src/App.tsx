import React, { useState, useEffect } from 'react';
import { BarcodeInput } from './components/BarcodeInput';
import { ImportCheck } from './components/ImportCheck';
import { BarcodeList } from './components/BarcodeList';
import { AdminPanel } from './components/admin/AdminPanel';
import { AdminLogin } from './components/AdminLogin';
import { ExportTab } from './components/ExportTab';
import { BarcodeSummaryComponent } from './components/BarcodeSummary';
import { LicenseTab } from './components/LicenseTab';
import { Layout } from './components/Layout';
import { BarcodeEntry, ExportOptions, TabType } from './types';
import { validateSystemLicense } from './utils/systemLicense';
import { exportBarcodeData } from './utils/export';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'barcodeEntries';

function App() {
  const [entries, setEntries] = useState<BarcodeEntry[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('scan');
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    delimiter: ';',
    format: 'txt',
    quantityPadding: 0
  });

  useEffect(() => {
    const storedEntries = localStorage.getItem(STORAGE_KEY);
    if (storedEntries) {
      try {
        const parsedEntries = JSON.parse(storedEntries);
        setEntries(parsedEntries);
      } catch (error) {
        console.error('Error loading stored entries:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving entries:', error);
    }
  }, [entries]);

  const handleBarcodeSubmit = (code: string, quantity: number) => {
    const newEntry: BarcodeEntry = {
      id: uuidv4(),
      code,
      quantity,
    };
    setEntries(prev => [...prev, newEntry]);
  };

  const handleDelete = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    setEntries(prev =>
      prev.map(entry =>
        entry.id === id ? { ...entry, quantity: newQuantity } : entry
      )
    );
  };

  const handleUpdateSummaryQuantity = (code: string, newQuantity: number) => {
    const totalEntries = entries.filter(entry => entry.code === code);
    const averageQuantity = Math.floor(newQuantity / totalEntries.length);
    const remainder = newQuantity % totalEntries.length;

    setEntries(prev => prev.map((entry, index) => {
      if (entry.code === code) {
        // Add 1 to the first 'remainder' number of entries to distribute the remainder
        const isRemainderEntry = index < remainder;
        return {
          ...entry,
          quantity: averageQuantity + (isRemainderEntry ? 1 : 0)
        };
      }
      return entry;
    }));
  };

  const handleReset = () => {
    setEntries([]);
  };

  const handleAdminAccess = (password: string) => {
    if (password === 'inventarioganzer') {
      setIsAdmin(true);
      setShowAdminLogin(false);
    }
  };

  const handleExport = async () => {
    const result = await exportBarcodeData(
      entries, 
      exportOptions.delimiter, 
      exportOptions.format,
      exportOptions.quantityPadding
    );
    if (!result.success && result.message) {
      alert(result.message);
    }
  };

  if (isAdmin) {
    return <AdminPanel />;
  }

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      onAdminClick={() => setShowAdminLogin(true)}
    >
      {activeTab === 'scan' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <BarcodeInput onSubmit={handleBarcodeSubmit} onReset={handleReset} />
          </div>
          <div>
            <BarcodeList 
              entries={entries}
              onDelete={handleDelete}
              onUpdateQuantity={handleUpdateQuantity}
              showAll={false}
              showProduct={false}
            />
          </div>
        </div>
      )}

      {activeTab === 'check' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <ImportCheck onSubmit={handleBarcodeSubmit} onReset={handleReset} />
          </div>
          <div>
            <BarcodeList 
              entries={entries}
              onDelete={handleDelete}
              onUpdateQuantity={handleUpdateQuantity}
              showAll={false}
              showProduct={true}
            />
          </div>
        </div>
      )}
      
      {activeTab === 'summary' && (
        <BarcodeSummaryComponent 
          entries={entries.reduce((acc, curr) => {
            const existing = acc.find(item => item.originalCode === curr.code);
            if (existing) {
              existing.totalQuantity += curr.quantity;
              existing.occurrences += 1;
            } else {
              acc.push({
                originalCode: curr.code,
                totalQuantity: curr.quantity,
                occurrences: 1
              });
            }
            return acc;
          }, [] as { originalCode: string; totalQuantity: number; occurrences: number }[])} 
          onDelete={(code) => {
            setEntries(prev => prev.filter(entry => entry.code !== code));
          }}
          onUpdateQuantity={handleUpdateSummaryQuantity}
        />
      )}

      {activeTab === 'export' && (
        <ExportTab
          options={exportOptions}
          onOptionsChange={setExportOptions}
          onExport={handleExport}
          entries={entries}
        />
      )}

      {activeTab === 'license' && <LicenseTab />}

      {showAdminLogin && (
        <AdminLogin 
          onSubmit={handleAdminAccess}
          onClose={() => setShowAdminLogin(false)}
        />
      )}
    </Layout>
  );
}

export default App;