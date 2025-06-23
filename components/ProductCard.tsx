// in components/ProductCard.tsx
"use client";

import type { Product } from '@/types';
import Link from 'next/link';

type ProductCardProps = {
  product: Product;
  disabled: boolean;
};

export default function ProductCard({ product, disabled }: ProductCardProps) {
  const { id, name, price, image_url } = product;

  // --- THIS IS THE FIX ---
  // Determine the correct image URL to display.
  // If image_url is an array and has items, use the first one.
  // Otherwise, fall back to a placeholder.
  const displayImageUrl = 
    Array.isArray(image_url) && image_url.length > 0 
    ? image_url[0] 
    : '/placeholder.svg';

  const cardContent = (
    <div className={`group relative border-2 border-dark-charcoal p-2 flex flex-col gap-2 rounded-lg shadow-lg bg-white/30 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
      <div className="w-full aspect-square overflow-hidden rounded-md relative">
        {/* Use the new displayImageUrl variable here */}
        <img 
          src={displayImageUrl} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
          loading="lazy"
        />
        {disabled && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white text-2xl font-heading rotate-[-15deg] border-2 border-white px-4 py-2">SOLD</span>
          </div>
        )}
      </div>
      <div className="flex flex-col p-2">
        <h3 className="font-body font-bold text-lg truncate text-dark-charcoal">{name}</h3>
        <p className="text-xl font-body text-vibrant-magenta font-semibold mt-1">₹{price}</p>
        <div className="mt-4 w-full bg-dark-charcoal text-white py-3 rounded-md font-bold text-center transition-colors duration-300 group-hover:bg-vibrant-magenta">
          {disabled ? 'Sold Out' : 'View Details'}
        </div>
      </div>
    </div>
  );

  return disabled ? (
    cardContent
  ) : (
    <Link href={`/product/${id}`} className="block no-underline text-inherit">
      {cardContent}
    </Link>
  );
}