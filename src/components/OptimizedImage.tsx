import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import { createPortal } from 'react-dom';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  onClick?: () => void;
  style?: React.CSSProperties;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  loading = 'lazy', 
  onClick, 
  style 
}) => {
  const [error, setError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // Extract path components
  const pathParts = src.split('/');
  const filename = pathParts[pathParts.length - 1];
  const folder = pathParts[pathParts.length - 2];
  const baseUrl = pathParts.slice(0, -1).join('/');
  const filenameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));
  const originalExt = filename.split('.').pop();
  
  // If the original is already WebP, don't try to load WebP version
  const isAlreadyWebP = originalExt?.toLowerCase() === 'webp';

  // Generate WebP filename based on folder type
  const webpName = (() => {
    // Special case for layout image in floorplan folder
    if (folder === 'floorplan' && filenameWithoutExt === '1') {
      return 'layout';
    }
    
    const number = filenameWithoutExt.replace(/\D/g, ''); // Extract number from filename
    switch(folder) {
      case 'exterior':
        return `ext${number}`;
      case 'interior':
        return `int${number}`;
      case 'floorplan':
        return `fp${number}`;
      case 'isometric':
        return `iso${number}`;
      default:
        return filenameWithoutExt;
    }
  })();

  // Generate paths for different formats
  const originalPath = src;
  const webpPath = `${baseUrl}/${webpName}.webp`;

  const handleImageClick = () => {
    if (onClick) {
      onClick();
    }
    setIsOpen(true);
  };

  const renderLightbox = () => (
    <Lightbox
      open={isOpen}
      close={() => setIsOpen(false)}
      slides={[{ src: originalPath }]}
      plugins={[Zoom]}
      zoom={{
        scrollToZoom: true,
        maxZoomPixelRatio: 5,
        zoomInMultiplier: 2,
        doubleTapDelay: 300,
      }}
    />
  );

  if (error || isAlreadyWebP) {
    return (
      <>
        <img
          src={originalPath}
          alt={alt}
          className={`${className} cursor-pointer`}
          loading={loading}
          onClick={handleImageClick}
          style={style}
        />
        {renderLightbox()}
      </>
    );
  }

  return (
    <>
      <picture className="inline-block cursor-pointer">
        <source
          srcSet={webpPath}
          type="image/webp"
        />
        <img
          src={originalPath}
          alt={alt}
          className={className}
          loading={loading}
          onClick={handleImageClick}
          style={style}
          onError={() => setError(true)}
        />
      </picture>
      {renderLightbox()}
    </>
  );
};

export default OptimizedImage;