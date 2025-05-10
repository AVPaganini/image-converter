import React, { useState, useCallback, useEffect } from 'react';
import { XCircle } from 'lucide-react';
import DragAndDrop from './components/DragAndDrop';
import ImageList from './components/ImageList';
import ConversionControls from './components/ConversionControls';
import Header from './components/Header';
import Footer from './components/Footer';
import { ConversionImage } from './types';
import { 
  convertToWebP, 
  downloadBlob, 
  generateId, 
  getWebPFileName 
} from './utils/imageConverter';

const App: React.FC = () => {
  const [images, setImages] = useState<ConversionImage[]>([]);
  const [quality, setQuality] = useState<number>(1); // 100% quality by default
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check if any image is in the converting state
  const anyConverting = images.some(img => img.status === 'converting');
  
  // Check if there are any completed images for download all button
  const hasCompletedImages = images.some(img => img.status === 'completed');

  // Handle file uploads
  const handleFilesAccepted = useCallback((files: File[]) => {
    const newImages: ConversionImage[] = files.map(file => {
      const reader = new FileReader();
      const image: ConversionImage = {
        id: generateId(),
        file,
        originalSrc: URL.createObjectURL(file),
        convertedSrc: null,
        originalSize: file.size,
        convertedSize: null,
        status: 'idle'
      };
      
      return image;
    });
    
    setImages(prev => [...prev, ...newImages]);
    setErrorMessage(null);
  }, []);

  // Handle quality change
  const handleQualityChange = useCallback((newQuality: number) => {
    setQuality(newQuality);
  }, []);

  // Convert a single image
  const convertImage = useCallback(async (image: ConversionImage): Promise<ConversionImage> => {
    if (image.status === 'converting' || image.status === 'completed') {
      return image;
    }
    
    const updatedImage = { ...image, status: 'converting' };
    
    try {
      const { blob, size } = await convertToWebP(image.file, quality);
      const convertedSrc = URL.createObjectURL(blob);
      
      return {
        ...updatedImage,
        convertedSrc,
        convertedSize: size,
        status: 'completed'
      };
    } catch (error) {
      console.error('Conversion error:', error);
      return {
        ...updatedImage,
        status: 'error',
        error: (error as Error).message
      };
    }
  }, [quality]);

  // Convert all images
  const handleConvertAll = useCallback(async () => {
    if (isConverting || images.length === 0) return;
    
    setIsConverting(true);
    setErrorMessage(null);
    
    try {
      const updatedImages = [...images];
      
      for (let i = 0; i < updatedImages.length; i++) {
        if (updatedImages[i].status !== 'completed') {
          const convertedImage = await convertImage(updatedImages[i]);
          updatedImages[i] = convertedImage;
          setImages([...updatedImages]); // Update state after each conversion
        }
      }
    } catch (error) {
      setErrorMessage((error as Error).message || 'An error occurred during conversion');
    } finally {
      setIsConverting(false);
    }
  }, [images, isConverting, convertImage]);

  // Download all converted images
  const handleDownloadAll = useCallback(() => {
    if (!hasCompletedImages) return;
    
    images.forEach(image => {
      if (image.status === 'completed' && image.convertedSrc) {
        fetch(image.convertedSrc)
          .then(res => res.blob())
          .then(blob => {
            downloadBlob(blob, getWebPFileName(image.file.name));
          });
      }
    });
  }, [images, hasCompletedImages]);

  // Remove an image
  const handleRemoveImage = useCallback((id: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      
      // Revoke object URLs for the removed image to prevent memory leaks
      const removedImage = prev.find(img => img.id === id);
      if (removedImage) {
        if (removedImage.originalSrc) URL.revokeObjectURL(removedImage.originalSrc);
        if (removedImage.convertedSrc) URL.revokeObjectURL(removedImage.convertedSrc);
      }
      
      return filtered;
    });
  }, []);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      images.forEach(image => {
        if (image.originalSrc) URL.revokeObjectURL(image.originalSrc);
        if (image.convertedSrc) URL.revokeObjectURL(image.convertedSrc);
      });
    };
  }, [images]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="container max-w-screen-xl mx-auto px-4 py-8 flex-grow">
        <Header />
        
        {errorMessage && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 flex items-center justify-between animate-fadeIn">
            <span>{errorMessage}</span>
            <button 
              onClick={() => setErrorMessage(null)}
              className="text-red-500 hover:text-red-700 transition-colors"
              aria-label="Dismiss error"
            >
              <XCircle size={18} />
            </button>
          </div>
        )}
        
        <DragAndDrop 
          onFilesAccepted={handleFilesAccepted} 
          disabled={anyConverting}
          multiple={true}
        />
        
        {images.length > 0 && (
          <ConversionControls 
            quality={quality}
            onQualityChange={handleQualityChange}
            onConvertAll={handleConvertAll}
            onDownloadAll={handleDownloadAll}
            hasCompletedImages={hasCompletedImages}
            isConverting={isConverting || anyConverting}
          />
        )}
        
        <ImageList 
          images={images}
          onRemoveImage={handleRemoveImage}
        />
      </div>
      
      <Footer />
    </div>
  );
};

export default App;
