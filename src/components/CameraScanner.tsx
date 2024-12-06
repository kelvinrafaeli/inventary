import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

interface CameraScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ onScan, onClose }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(true); // Controla a câmera
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);

  useEffect(() => {
    const setupCamera = async () => {
      try {
        if (!scannerRef.current) {
          scannerRef.current = new Html5Qrcode("reader");
        }
        const cameras = await Html5Qrcode.getCameras();
        if (cameras && cameras.length > 0) {
          const backCamera = cameras.find(camera =>
            camera.label.toLowerCase().includes('back') ||
            camera.label.toLowerCase().includes('rear') ||
            camera.label.toLowerCase().includes('environment')
          );
          setSelectedCameraId((backCamera || cameras[0]).id); // Seleciona a câmera
        }
      } catch (err) {
        console.error("Erro ao configurar a câmera:", err);
      }
    };

    setupCamera();
  }, []);

  useEffect(() => {
    const startScanner = async () => {
      if (!selectedCameraId || !scannerRef.current) return;

      await scannerRef.current.start(
        selectedCameraId,
        {
          fps: 15,
          qrbox: { width: 300, height: 200 },
          aspectRatio: 1.0,
          disableFlip: true,
        },
        async (decodedText) => {
          // Emitir som ao escanear
          const audio = new Audio('data:audio/wav;base64,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');
          audio.play();

          // Callback com o resultado
          onScan(decodedText);

          // Reiniciar scanner fechando e reabrindo
          setIsCameraOpen(false); // Fecha a câmera
          setTimeout(() => setIsCameraOpen(true), 1); // Reabre rapidamente
        },
        (errorMessage) => {
          console.log("Erro de leitura:", errorMessage);
        }
      );
    };

    if (isCameraOpen) {
      startScanner();
    } else if (scannerRef.current?.isScanning) {
      scannerRef.current.stop().catch(console.error);
    }
  }, [isCameraOpen, selectedCameraId, onScan]);

  if (!isCameraOpen) {
    return null; // Não renderiza quando a câmera está fechada
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-lg w-full mx-4">
        <button
          onClick={() => {
            if (scannerRef.current?.isScanning) {
              scannerRef.current.stop().catch(console.error);
            }
            onClose();
          }}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-10"
        >
          <X size={24} />
        </button>

        <h3 className="text-lg font-semibold mb-4">Escaneie o Código de Barras</h3>

        <div id="reader" className="w-full"></div>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Posicione o código de barras dentro da área demarcada
        </p>
      </div>
    </div>
  );
};
