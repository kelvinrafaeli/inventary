import { BarcodeEntry } from '../types';
import { validateSystemLicense } from './systemLicense';

const checkInternetConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch('https://www.google.com/favicon.ico', {
      mode: 'no-cors',
      cache: 'no-store'
    });
    return true;
  } catch (error) {
    return false;
  }
};

const validateLicenseWithServer = async (licenseKey: string): Promise<boolean> => {
  try {
    const adminLicenses = localStorage.getItem('adminLicenses');
    if (!adminLicenses) {
      return false;
    }

    const licenses = JSON.parse(adminLicenses);
    return licenses.some((license: any) => license.key === licenseKey && new Date(license.expirationDate) > new Date());
  } catch (error) {
    return false;
  }
};

const padQuantity = (quantity: number, padding: number): string => {
  if (padding <= 0) return quantity.toString();
  return quantity.toString().padStart(padding, '0');
};

const normalizeBarcode = (code: string): string => {
  return code.trim().replace(/^0+/, '');
};

export const exportBarcodeData = async (
  entries: BarcodeEntry[],
  delimiter: string,
  format: 'txt' | 'csv',
  quantityPadding: number = 0
): Promise<{ success: boolean; message?: string }> => {
  const isOnline = await checkInternetConnection();
  if (!isOnline) {
    return {
      success: false,
      message: 'Sem conexão com a internet. Por favor, verifique sua conexão e tente novamente.'
    };
  }

  const storedLicense = localStorage.getItem('systemLicense');
  if (!storedLicense) {
    return {
      success: false,
      message: 'Licença não encontrada. Por favor, ative uma licença válida para exportar os dados.'
    };
  }

  const isValidOnServer = await validateLicenseWithServer(storedLicense);
  if (!isValidOnServer) {
    localStorage.removeItem('systemLicense');
    return {
      success: false,
      message: 'Licença inválida ou expirada. Por favor, ative uma licença válida para exportar os dados.'
    };
  }

  try {
    // Create a map to combine quantities for identical codes
    const combinedEntries = new Map<string, number>();
    
    entries.forEach(entry => {
      const normalizedCode = normalizeBarcode(entry.code);
      const currentQuantity = combinedEntries.get(normalizedCode) || 0;
      combinedEntries.set(normalizedCode, currentQuantity + entry.quantity);
    });

    // Convert the map back to an array and format the output
    const data = Array.from(combinedEntries.entries())
      .map(([code, quantity]) => {
        // Add leading zeros back to the code to maintain original format
        const formattedCode = code.padStart(14, '0');
        return `${formattedCode}${delimiter}${padQuantity(quantity, quantityPadding)}`;
      })
      .join('\n');

    // Add BOM for UTF-8
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + data], { 
      type: format === 'csv' ? 'text/csv;charset=utf-8' : 'text/plain;charset=utf-8'
    });

    const now = new Date();
    const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
    const filename = `inventario_${timestamp}.${format}`;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: 'Erro ao exportar os dados. Por favor, tente novamente.'
    };
  }
};