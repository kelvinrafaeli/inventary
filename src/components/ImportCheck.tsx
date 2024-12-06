import React, { useState, useRef, useEffect } from 'react';
import { Keyboard, Camera, Plus, Minus, Package, Trash2 } from 'lucide-react';
import { CameraScanner } from './CameraScanner';
import { ProductReference } from '../types';
import { normalizeBarcode, findProduct } from '../utils/productUtils';

interface ImportCheckProps {
  onSubmit: (code: string, quantity: number) => void;
  onReset: () => void;
}

export const ImportCheck: React.FC<ImportCheckProps> = ({ onSubmit, onReset }) => {
  const [code, setCode] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isKeyboardEnabled, setIsKeyboardEnabled] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [importedProducts, setImportedProducts] = useState<ProductReference[]>([]);
  const [scannedCodes, setScannedCodes] = useState<Set<string>>(new Set());
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const products = JSON.parse(localStorage.getItem('importedProducts') || '[]');
      setImportedProducts(products);
      setTotalProducts(products.length);

      const savedScannedCodes = JSON.parse(localStorage.getItem('scannedCodes') || '[]');
      setScannedCodes(new Set(savedScannedCodes));
    } catch (error) {
      console.error('Error loading data:', error);
      setImportedProducts([]);
      setScannedCodes(new Set());
      setTotalProducts(0);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('scannedCodes', JSON.stringify(Array.from(scannedCodes)));
    } catch (error) {
      console.error('Error saving scanned codes:', error);
    }
  }, [scannedCodes]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [code]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const product = findProduct(code.trim());
    if (!product) {
      if (window.confirm('Código não encontrado na lista de referência. Deseja adicionar mesmo assim?')) {
        onSubmit(code.trim(), quantity);
        setScannedCodes(prev => new Set(prev).add(normalizeBarcode(code.trim())));
      }
    } else {
      onSubmit(code.trim(), quantity);
      setScannedCodes(prev => new Set(prev).add(normalizeBarcode(code.trim())));
    }

    setCode('');
    setQuantity(1); // Reset quantity to 1 after submission
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 300);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleScan = (scannedCode: string) => {
    setCode(scannedCode);
    setQuantity(1); // Reset quantity to 1 after camera scan
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleReset = () => {
    if (window.confirm('Tem certeza que deseja apagar todas as leituras? Esta ação não pode ser desfeita.')) {
      onReset();
      setCode('');
      setQuantity(1);
      setScannedCodes(new Set());
      localStorage.removeItem('scannedCodes');
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleClearImported = () => {
    if (window.confirm('Tem certeza que deseja remover todos os produtos importados?')) {
      localStorage.removeItem('importedProducts');
      localStorage.removeItem('scannedCodes');
      setImportedProducts([]);
      setScannedCodes(new Set());
      setTotalProducts(0);
    }
  };

  const remainingItems = totalProducts - scannedCodes.size;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 text-xs">
          <Package size={14} className="text-red-600" />
          <span>Produtos: <b>{totalProducts}</b> | Restantes: <b className="text-red-600">{remainingItems}</b></span>
        </div>
        <button
          onClick={handleClearImported}
          className="p-1 text-gray-400 hover:text-red-600"
          title="Remover produtos importados"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 transition-colors duration-300 ${
                showFlash ? 'bg-green-100' : 'bg-white'
              }`}
              placeholder="Digite ou escaneie o código"
              inputMode={isKeyboardEnabled ? "text" : "none"}
              autoComplete="off"
            />
            <div className="absolute right-0 top-0 h-full flex items-center gap-1 pr-1">
              <button
                type="button"
                onClick={() => setShowScanner(true)}
                className="p-1 text-gray-400 hover:text-red-600"
              >
                <Camera size={18} />
              </button>
              <button
                type="button"
                onClick={() => setIsKeyboardEnabled(!isKeyboardEnabled)}
                className={`p-1 ${isKeyboardEnabled ? 'text-red-600' : 'text-gray-400 hover:text-red-600'}`}
              >
                <Keyboard size={18} />
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              className="p-2 text-red-600 hover:bg-red-50 rounded-md"
            >
              <Minus size={18} />
            </button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-center"
            />
            <button
              type="button"
              onClick={() => setQuantity(prev => prev + 1)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-md"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 px-3 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm"
          >
            Adicionar
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 px-3 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm"
          >
            Zerar Leituras
          </button>
        </div>
      </form>

      {showScanner && (
        <CameraScanner
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
};