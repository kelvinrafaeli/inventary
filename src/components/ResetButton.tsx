import React from 'react';
import { Trash2 } from 'lucide-react';

interface ResetButtonProps {
  onReset: () => void;
}

export const ResetButton: React.FC<ResetButtonProps> = ({ onReset }) => {
  const handleClick = () => {
    if (window.confirm('Tem certeza que deseja apagar todas as leituras? Esta ação não pode ser desfeita.')) {
      onReset();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
    >
      <Trash2 size={18} className="mr-2" />
      Zerar Leituras
    </button>
  );
};