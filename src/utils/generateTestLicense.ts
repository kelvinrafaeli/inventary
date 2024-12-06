import { generateSystemLicense } from './systemLicense';

// Generate a 30-day license key
const licenseKey = generateSystemLicense(30);
console.log('Test License Key (valid for 30 days):', licenseKey);