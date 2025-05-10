import React from 'react';
import { Download, Trash2, AlertTriangle } from 'lucide-react';
import { ConversionImage } from '../types';
import { downloadBlob, formatFileSize, calculateSavings, getWebPFileName } from '../utils/imageConverter';

interface ImagePreviewProps {
  image: ConversionImage;
  onRemove: (id: string) => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ image, onRemove }) => {
  const handleDownload = () => {
    if (image.convertedSrc && image.status === 'completed') {
      fetch(image.convertedSrc)
        .then(res => res.blob())
        .then(blob => {
          downloadBlob(blob, getWebPFileName(image.file.name));
        });
    }
  };

  const renderStatus = () => {
    switch (image.status) {
      case 'converting':
        return (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
            <span className="text-blue-600">Converting...</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center space-x-2 text-red-500">
            <AlertTriangle size={16} />
            <span>{image.error || 'Conversion failed'}</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-fadeIn">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-800 truncate max-w-[200px]" title={image.file.name}>
            {image.file.name}
          </h3>
          <button
            onClick={() => onRemove(image.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Remove image"
          >
            <Trash2 size={18} />
          </button>
        </div>
        {renderStatus()}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Original (PNG)</h4>
          <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
            <img
              src={image.originalSrc}
              alt="Original"
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Size: {formatFileSize(image.originalSize)}
          </p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Converted (WebP)</h4>
          <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
            {image.convertedSrc ? (
              <img
                src={image.convertedSrc}
                alt="Converted"
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="text-gray-400 text-sm">Not converted yet</div>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Size: {formatFileSize(image.convertedSize)}
            {image.convertedSize && (
              <span className="ml-2 text-green-600 font-medium">
                ({calculateSavings(image.originalSize, image.convertedSize)} saved)
              </span>
            )}
          </p>
        </div>
      </div>

      {image.status === 'completed' && (
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={handleDownload}
            className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-md flex items-center justify-center space-x-2 transition-colors duration-200"
          >
            <Download size={16} />
            <span>Download WebP</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;