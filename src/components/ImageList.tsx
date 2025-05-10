import React from 'react';
import { ConversionImage } from '../types';
import ImagePreview from './ImagePreview';

interface ImageListProps {
  images: ConversionImage[];
  onRemoveImage: (id: string) => void;
}

const ImageList: React.FC<ImageListProps> = ({ images, onRemoveImage }) => {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {images.map(image => (
        <ImagePreview 
          key={image.id} 
          image={image} 
          onRemove={onRemoveImage} 
        />
      ))}
    </div>
  );
};

export default ImageList;