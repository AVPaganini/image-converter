import React from 'react';
import { Info } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 mt-auto">
      <div className="max-w-xl mx-auto text-center">
        <div className="bg-blue-50 rounded-lg p-4 mb-6 flex items-start">
          <div className="text-blue-500 mr-3 flex-shrink-0 mt-0.5">
            <Info size={20} />
          </div>
          <p className="text-sm text-blue-800 text-left">
            WebP images typically reduce file size by 25-35% compared to PNG while maintaining similar quality,
            resulting in faster website loading times and lower bandwidth usage.
          </p>
        </div>

        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} PNG to WebP Converter. All conversions happen locally in your browser - 
          no images are uploaded to any server.
        </p>
      </div>
    </footer>
  );
};

export default Footer;