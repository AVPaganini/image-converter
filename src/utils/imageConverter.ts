/**
 * Converts a PNG image to WebP format
 * @param file The PNG file to convert
 * @param quality The quality of the WebP image (0-1)
 * @returns A promise that resolves to an object containing the WebP blob and its size
 */
export const convertToWebP = async (
  file: File,
  quality: number
): Promise<{ blob: Blob; size: number }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      
      img.onload = () => {
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw image on canvas
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0);
        
        // Convert to WebP
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to convert image'));
              return;
            }
            
            resolve({
              blob,
              size: blob.size
            });
          },
          'image/webp',
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = event.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Creates a downloadable link for a blob
 * @param blob The blob to create a download link for
 * @param fileName The name to give the downloaded file
 */
export const downloadBlob = (blob: Blob, fileName: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Formats a file size in bytes to a human-readable string
 * @param bytes The file size in bytes
 * @returns A formatted string (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes: number | null): string => {
  if (bytes === null) return '-';
  
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

/**
 * Calculates the percentage saved between original and converted file sizes
 * @param originalSize The original file size in bytes
 * @param convertedSize The converted file size in bytes
 * @returns The percentage saved as a string
 */
export const calculateSavings = (originalSize: number, convertedSize: number | null): string => {
  if (convertedSize === null) return '-';
  
  const saved = originalSize - convertedSize;
  const percentage = (saved / originalSize) * 100;
  
  return `${Math.round(percentage)}%`;
};

/**
 * Generates a unique ID
 * @returns A unique string ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

/**
 * Changes the file extension to .webp
 * @param fileName The original file name
 * @returns The file name with .webp extension
 */
export const getWebPFileName = (fileName: string): string => {
  const lastDotIndex = fileName.lastIndexOf('.');
  const baseName = lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;
  return `${baseName}.webp`;
};

/**
 * Checks if a file is a PNG image
 * @param file The file to check
 * @returns True if the file is a PNG image
 */
export const isPngImage = (file: File): boolean => {
  return file.type === 'image/png';
};