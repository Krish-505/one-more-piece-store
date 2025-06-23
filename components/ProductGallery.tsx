// in components/ProductGallery.tsx
"use client";

import { useState } from 'react';

type ProductGalleryProps = {
  // This correctly expects an array of strings
  imageUrls: string[]; 
  productName: string;
};

export default function ProductGallery({ imageUrls, productName }: ProductGalleryProps) {
  // Check if imageUrls is empty before accessing the first element
  const [mainImage, setMainImage] = useState(imageUrls.length > 0 ? imageUrls[0] : '/placeholder.svg');

  if (imageUrls.length === 0) {
    return <div>No images available.</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="w-full aspect-square overflow-hidden rounded-lg shadow-lg border-2 border-gray-200">
        <img 
          src={mainImage} 
          alt={`Main view of ${productName}`}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Thumbnails */}
      <div className="grid grid-cols-5 gap-2">
        {imageUrls.map((url, index) => (
          <div 
            key={index} 
            onClick={() => setMainImage(url)}
            className={`w-full aspect-square overflow-hidden rounded-md cursor-pointer border-2 transition-all ${mainImage === url ? 'border-vibrant-magenta' : 'border-transparent'}`}
          >
            <img 
              src={url} 
              alt={`Thumbnail ${index + 1} of ${productName}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}