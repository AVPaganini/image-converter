import React from 'react';
import { ImageIcon } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="py-6 mb-6">
      <div className="flex flex-col items-center text-center">
        <div className="bg-blue-100 p-3 rounded-full text-blue-600 mb-4">
          <ImageIcon size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">PNG to WebP Converter</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Convert your PNG images to WebP format right in your browser. No uploads to any server - 
          all conversions happen locally on your device for maximum privacy.
        </p>
      </div>
    </header>
  );
};

export default Header;