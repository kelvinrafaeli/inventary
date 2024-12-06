import React, { useState, useRef, useEffect } from 'react';
import { Keyboard, Camera, Plus, Minus } from 'lucide-react';
import { CameraScanner } from './CameraScanner';

interface BarcodeInputProps {
  onSubmit: (code: string, quantity: number) => void;
  onReset: () => void;
}

export const BarcodeInput: React.FC<BarcodeInputProps> = ({ onSubmit, onReset }) => {
  const [code, setCode] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isKeyboardEnabled, setIsKeyboardEnabled] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [code]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onSubmit(code.trim(), quantity);
      setCode('');
      setQuantity(1); // Reset quantity to 1 after submission
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 300);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleScan = (scannedCode: string) => {
    onSubmit(scannedCode, quantity);
    setQuantity(1); // Reset quantity to 1 after camera scan
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 300);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && code.trim()) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleKeyboard = () => {
    setIsKeyboardEnabled(!isKeyboardEnabled);
    if (!isKeyboardEnabled && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const handleReset = () => {
    if (window.confirm('Tem certeza que deseja apagar todas as leituras? Esta ação não pode ser desfeita.')) {
      onReset();
      setCode('');
      setQuantity(1);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={code}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
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
                onClick={toggleKeyboard}
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
              onClick={decrementQuantity}
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
              onClick={incrementQuantity}
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
    </>
  );
};