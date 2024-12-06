import { ProductReference } from '../types';

export const normalizeBarcode = (code: string): string => {
  // Remove leading zeros and trim whitespace
  return code.trim().replace(/^0+/, '');
};

export const findProduct = (code: string): ProductReference | null => {
  try {
    const products = JSON.parse(localStorage.getItem('importedProducts') || '[]') as ProductReference[];
    if (!products.length) return null;

    const normalizedSearchCode = normalizeBarcode(code);
    
    // Find product by normalized code comparison
    const product = products.find(product => {
      const normalizedProductCode = normalizeBarcode(product.code);
      return normalizedProductCode === normalizedSearchCode;
    });

    return product || null;
  } catch (error) {
    console.error('Error finding product:', error);
    return null;
  }
};

export const getProductName = (code: string): string => {
  const product = findProduct(code);
  return product ? product.name : '-';
};