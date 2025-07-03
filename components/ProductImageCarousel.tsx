// in components/ProductImageCarousel.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Fade from 'embla-carousel-fade';

type PropType = {
  slides: string[];
  options?: any;
};

const ProductImageCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  
  // --- THIS IS THE FIX ---
  // We initialize the Fade plugin here. It will now handle the styles.
  const [emblaRef, emblaApi] = useEmblaCarousel({ ...options, loop: true }, [Fade()]);
  
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => { emblaApi.off('select', onSelect) };
  }, [emblaApi]);

  return (
    <div className="w-full">
      {/* We use a wrapper to create the aspect ratio, leaving embla__viewport clean */}
      <div className="overflow-hidden aspect-square rounded-lg shadow-lg border-2 border-gray-200" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((imgUrl, index) => (
            // The slide takes up the full space
            <div className="flex-[0_0_100%] min-w-0 relative" key={index}>
              <img
                className="absolute top-0 left-0 w-full h-full object-cover"
                src={imgUrl}
                alt={`Product image ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Dots for navigation */}
      <div className="flex justify-center items-center gap-2 mt-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === selectedIndex ? 'bg-dark-charcoal scale-125' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductImageCarousel;