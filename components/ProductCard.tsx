// in components/ProductCard.tsx
import type { Product } from '@/types'; // Import our shared type

// --- THE FIX IS HERE ---
// We update the props definition to accept a 'product' object and a 'disabled' boolean.
type ProductCardProps = {
  product: Product;
  disabled: boolean;
};

export default function ProductCard({ product, disabled }: ProductCardProps) {
  // We can now destructure the properties from the product object
  const { name, price, image_url } = product;

  return (
    // The conditional class makes the whole card look faded if disabled
    <div className={`border-2 border-dark-charcoal p-4 flex flex-col gap-4 rounded-md shadow-lg bg-white/20 transition-opacity ${disabled ? 'opacity-60' : ''}`}>
      
      <div className="w-full aspect-square overflow-hidden rounded-md relative">
        {/* The 'relative' class is for the "Sold Out" overlay */}
        
        <img 
          src={image_url || '/placeholder.svg'} 
          alt={name}
          className="w-full h-full object-cover" 
          loading="lazy"
        />

        {/* This overlay will only show if the item is disabled (sold) */}
        {disabled && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white text-2xl font-heading rotate-[-15deg] border-2 border-white px-4 py-2">SOLD</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-body font-bold text-lg truncate">{name}</h3>
        <p className="text-xl font-body text-vibrant-magenta font-semibold">₹{price}</p>
        
        {/* The button is disabled and its text changes if the product is sold */}
        <button 
          className="w-full bg-vibrant-magenta text-white py-2 rounded-md font-bold transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
          disabled={disabled}
        >
          {disabled ? 'Sold Out' : 'View Details'}
        </button>
      </div>
    </div>
  );
}