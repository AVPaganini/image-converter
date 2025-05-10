import React from 'react';
import { RefreshCw, Download } from 'lucide-react';

interface ConversionControlsProps {
  quality: number;
  onQualityChange: (quality: number) => void;
  onConvertAll: () => void;
  onDownloadAll: () => void;
  hasCompletedImages: boolean;
  isConverting: boolean;
}

const ConversionControls: React.FC<ConversionControlsProps> = ({
  quality,
  onQualityChange,
  onConvertAll,
  onDownloadAll,
  hasCompletedImages,
  isConverting
}) => {
  const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onQualityChange(Number(e.target.value) / 100);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="quality" className="block text-sm font-medium text-gray-700 mb-1">
            WebP Quality: {Math.round(quality * 100)}%
          </label>
          <input
            type="range"
            id="quality"
            min="1"
            max="100"
            value={quality * 100}
            onChange={handleQualityChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Lower Quality</span>
            <span>Better Quality</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <button
            onClick={onConvertAll}
            disabled={isConverting}
            className={`py-2 px-4 rounded-md flex items-center justify-center space-x-2 transition-colors duration-200 ${
              isConverting
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <RefreshCw size={16} className={isConverting ? 'animate-spin' : ''} />
            <span>{isConverting ? 'Converting...' : 'Convert All'}</span>
          </button>
          
          <button
            onClick={onDownloadAll}
            disabled={!hasCompletedImages}
            className={`py-2 px-4 rounded-md flex items-center justify-center space-x-2 transition-colors duration-200 ${
              !hasCompletedImages
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-teal-600 text-white hover:bg-teal-700'
            }`}
          >
            <Download size={16} />
            <span>Download All</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversionControls;