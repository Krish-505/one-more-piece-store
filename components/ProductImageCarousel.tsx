// in components/ProductImageCarousel.tsx
"use client";

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';

type PropType = {
  slides: string[]; // Expects an array of image URLs
  options?: any;
};

const ProductImageCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="embla w-full">
      <div className="embla__viewport overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex">
          {slides.map((imgUrl, index) => (
            <div className="embla__slide flex-[0_0_100%]" key={index}>
              <img
                className="embla__slide__img w-full h-auto object-cover"
                src={imgUrl}
                alt={`Product image ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
      {/* Dots for navigation */}
      <div className="embla__dots flex justify-center items-center gap-2 mt-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`embla__dot w-3 h-3 rounded-full transition-all ${
              index === selectedIndex ? 'bg-dark-charcoal scale-125' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductImageCarousel;