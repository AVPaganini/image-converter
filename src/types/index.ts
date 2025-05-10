export interface ConversionImage {
  id: string;
  file: File;
  originalSrc: string;
  convertedSrc: string | null;
  originalSize: number;
  convertedSize: number | null;
  status: 'idle' | 'converting' | 'completed' | 'error';
  error?: string;
}