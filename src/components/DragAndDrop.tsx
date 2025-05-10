import React, { useCallback, useState } from 'react';
import { Upload, XCircle } from 'lucide-react';
import { isPngImage } from '../utils/imageConverter';

interface DragAndDropProps {
  onFilesAccepted: (files: File[]) => void;
  disabled?: boolean;
  multiple?: boolean;
}

const DragAndDrop: React.FC<DragAndDropProps> = ({
  onFilesAccepted,
  disabled = false,
  multiple = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragError, setDragError] = useState<string | null>(null);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);
  
  const validateFiles = useCallback((files: File[]): File[] => {
    setDragError(null);
    const validFiles = Array.from(files).filter(file => isPngImage(file));
    
    if (validFiles.length === 0) {
      setDragError('Please select PNG images only');
      return [];
    }
    
    if (!multiple && validFiles.length > 1) {
      return [validFiles[0]];
    }
    
    return validFiles;
  }, [multiple]);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;
    
    const validFiles = validateFiles(Array.from(e.dataTransfer.files));
    if (validFiles.length > 0) {
      onFilesAccepted(validFiles);
    }
  }, [disabled, onFilesAccepted, validateFiles]);
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || !e.target.files) return;
    
    const validFiles = validateFiles(Array.from(e.target.files));
    if (validFiles.length > 0) {
      onFilesAccepted(validFiles);
    }
    
    // Reset the input
    e.target.value = '';
  }, [disabled, onFilesAccepted, validateFiles]);
  
  const handleDismissError = useCallback(() => {
    setDragError(null);
  }, []);
  
  return (
    <div className="relative">
      {dragError && (
        <div className="absolute top-0 left-0 right-0 bg-red-100 text-red-600 p-3 rounded-md flex items-center justify-between mb-4 animate-fadeIn">
          <span>{dragError}</span>
          <button 
            onClick={handleDismissError}
            className="text-red-500 hover:text-red-700 transition-colors"
            aria-label="Dismiss error"
          >
            <XCircle size={18} />
          </button>
        </div>
      )}
      
      <div
        className={`mt-8 border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : disabled 
              ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
        } ${dragError ? 'mt-16' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className={`p-3 rounded-full ${
            isDragging 
              ? 'bg-blue-100 text-blue-600' 
              : disabled 
                ? 'bg-gray-100 text-gray-400' 
                : 'bg-gray-100 text-gray-600'
          }`}>
            <Upload size={24} />
          </div>
          <div className="space-y-1">
            <h3 className={`text-lg font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
              {multiple ? 'Upload PNG images' : 'Upload a PNG image'}
            </h3>
            <p className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>
              Drag and drop, or click to select
            </p>
          </div>
          
          <input
            type="file"
            accept="image/png"
            className="hidden"
            onChange={handleChange}
            disabled={disabled}
            multiple={multiple}
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className={`py-2 px-4 rounded-md text-sm font-medium ${
              disabled
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
            } transition-colors duration-200`}
          >
            Select {multiple ? 'files' : 'file'}
          </label>
        </div>
      </div>
    </div>
  );
};

export default DragAndDrop;