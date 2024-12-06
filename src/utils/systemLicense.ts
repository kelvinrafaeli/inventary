import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your-secret-key-here';
const MASTER_KEY = 'KELVINRAFAELIGANZERAUTOMACAO';
const ADMIN_KEY = 'ganzerinventario';
const LICENSES_STORAGE_KEY = 'adminLicenses';

export const generateSystemLicense = (days: number): string => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + days);
  
  const licenseData = {
    expirationDate: expirationDate.toISOString(),
    uniqueId: CryptoJS.lib.WordArray.random(16).toString(),
  };

  return CryptoJS.AES.encrypt(
    JSON.stringify(licenseData),
    SECRET_KEY
  ).toString();
};

export const validateSystemLicense = (licenseKey: string): { isValid: boolean; expirationDate: Date | null; isAdmin: boolean } => {
  // Check for admin keys
  if (licenseKey === MASTER_KEY || licenseKey === ADMIN_KEY) {
    const farFutureDate = new Date();
    farFutureDate.setFullYear(farFutureDate.getFullYear() + 100);
    return {
      isValid: true,
      expirationDate: farFutureDate,
      isAdmin: true,
    };
  }

  try {
    // Check if the license has been deleted
    const storedLicenses = localStorage.getItem(LICENSES_STORAGE_KEY);
    if (storedLicenses) {
      const licenses = JSON.parse(storedLicenses);
      const licenseExists = licenses.some((license: any) => license.key === licenseKey);
      if (!licenseExists) {
        return {
          isValid: false,
          expirationDate: null,
          isAdmin: false,
        };
      }
    }

    const decrypted = CryptoJS.AES.decrypt(licenseKey, SECRET_KEY).toString(CryptoJS.enc.Utf8);
    const licenseData = JSON.parse(decrypted);
    const expirationDate = new Date(licenseData.expirationDate);
    
    return {
      isValid: expirationDate > new Date(),
      expirationDate,
      isAdmin: false,
    };
  } catch {
    return {
      isValid: false,
      expirationDate: null,
      isAdmin: false,
    };
  }
};

export const clearAllStorage = () => {
  localStorage.clear();
};