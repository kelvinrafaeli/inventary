export const generateLicense = (serialNumber: string): string => {
  return serialNumber; // Now just returns the raw barcode
};

export const exportData = (
  data: { code: string; quantity: number }[],
  delimiter: string
): string => {
  return data.map(entry => `${entry.code}${delimiter}${entry.quantity}`).join('\n');
};

export const getExportFilename = (format: string): string => {
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const time = now.toTimeString().split(' ')[0].replace(/:/g, '-');
  return `barcodes_${date}_${time}.${format}`;
};