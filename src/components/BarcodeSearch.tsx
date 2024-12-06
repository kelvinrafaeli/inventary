import React, { useState, useRef } from 'react';
import { Search, Edit2, Trash2, Save, X, Camera, Keyboard } from 'lucide-react';
import { BarcodeSummary } from '../types';
import { CameraScanner } from './CameraScanner';

interface BarcodeSearchProps {
  onSearch: (code: string) => BarcodeSummary | null;
  onDelete?: (code: string) => void;
  onUpdateQuantity?: (code: string, newQuantity: number) => void;
}

export const BarcodeSearch: React.FC<BarcodeSearchProps> = ({ 
  onSearch, 
  onDelete,
  onUpdateQuantity 
}) => {
  const [searchCode, setSearchCode] = useState('');
  const [searchResult, setSearchResult] = useState<BarcodeSummary | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editQuantity, setEditQuantity] = useState<number>(0);
  const [showScanner, setShowScanner] = useState(false);
  const [isKeyboardEnabled, setIsKeyboardEnabled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const result = onSearch(searchCode.trim());
    setSearchResult(result);
    setNotFound(!result);
    if (result) {
      setEditQuantity(result.totalQuantity);
      setSearchCode('');
    }
  };

  const handleSave = () => {
    if (searchResult && onUpdateQuantity && editQuantity > 0) {
      onUpdateQuantity(searchResult.originalCode, editQuantity);
      setIsEditing(false);
      // Refresh search result
      const updatedResult = onSearch(searchResult.originalCode);
      setSearchResult(updatedResult);
    }
  };

  const handleDelete = () => {
    if (searchResult && onDelete) {
      onDelete(searchResult.originalCode);
      setSearchResult(null);
      setSearchCode('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const result = onSearch(searchCode.trim());
      setSearchResult(result);
      setNotFound(!result);
      if (result) {
        setEditQuantity(result.totalQuantity);
        setSearchCode('');
      }
    }
  };

  const handleScan = (scannedCode: string) => {
    const result = onSearch(scannedCode.trim());
    setSearchResult(result);
    setNotFound(!result);
    if (result) {
      setEditQuantity(result.totalQuantity);
      setSearchCode('');
    }
    // Play beep sound on successful scan
    const audio = new Audio('data:audio/wav;base64,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');
    audio.play();
  };

  return (
    <div className="mb-8 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Pesquisar Código</h3>
      
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={searchCode}
            onChange={(e) => {
              setSearchCode(e.target.value);
              setSearchResult(null);
              setNotFound(false);
              setIsEditing(false);
            }}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-2 pr-24 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            placeholder="Digite ou escaneie o código para pesquisar"
            inputMode={isKeyboardEnabled ? "text" : "none"}
            autoComplete="off"
            autoFocus
          />
          <div className="absolute right-2 top-2 flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowScanner(true)}
              className="p-1 text-gray-400 hover:text-red-600"
              title="Usar câmera"
            >
              <Camera size={20} />
            </button>
            <button
              type="button"
              onClick={() => setIsKeyboardEnabled(!isKeyboardEnabled)}
              className={`p-1 ${isKeyboardEnabled ? 'text-red-600' : 'text-gray-400 hover:text-red-600'}`}
              title="Usar teclado"
            >
              <Keyboard size={20} />
            </button>
            <button
              type="submit"
              className="p-1 text-gray-400 hover:text-red-600"
              title="Pesquisar"
            >
              <Search size={20} />
            </button>
          </div>
        </div>
      </form>

      {searchResult && (
        <div className="mt-4 p-4 bg-white rounded-md shadow-sm">
          <h4 className="font-medium text-gray-900 mb-4">Resultado da Pesquisa:</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Código</dt>
                <dd className="mt-1 text-sm text-gray-900">{searchResult.originalCode}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Quantidade Total</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {isEditing ? (
                    <input
                      type="number"
                      min="1"
                      value={editQuantity}
                      onChange={(e) => setEditQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                    />
                  ) : (
                    searchResult.totalQuantity
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Ocorrências</dt>
                <dd className="mt-1 text-sm text-gray-900">{searchResult.occurrences}</dd>
              </div>
            </div>

            {(onDelete || onUpdateQuantity) && (
              <div className="flex justify-end space-x-2 pt-2 border-t">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex items-center px-3 py-1 text-sm text-green-600 hover:text-green-800"
                      title="Salvar"
                    >
                      <Save size={16} className="mr-1" />
                      Salvar
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                      title="Cancelar"
                    >
                      <X size={16} className="mr-1" />
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    {onUpdateQuantity && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                        title="Editar quantidade"
                      >
                        <Edit2 size={16} className="mr-1" />
                        Editar
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={handleDelete}
                        className="flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-800"
                        title="Excluir"
                      >
                        <Trash2 size={16} className="mr-1" />
                        Excluir
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {notFound && (
        <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded-md">
          Nenhum código encontrado para "{searchCode}"
        </div>
      )}

      {showScanner && (
        <CameraScanner
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
};