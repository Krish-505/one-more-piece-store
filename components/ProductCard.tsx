// in components/ProductCard.tsx

// We are NOT importing 'next/image' anymore.

type ProductCardProps = {
  name: string;
  price: number;
  imageUrl: string;
};

export default function ProductCard({ name, price, imageUrl }: ProductCardProps) {
  return (
    <div className="border-2 border-dark-charcoal p-4 flex flex-col gap-4 rounded-md shadow-lg bg-white/20">
      
      {/* This div still provides the square shape for the image */}
      <div className="w-full aspect-square overflow-hidden rounded-md">
        
        {/* --- THE FIX IS HERE --- */}
        {/* We are using a standard HTML <img> tag instead of next/image's <Image> */}
        {/* This bypasses the Next.js image optimization and the hostname error. */}
        <img 
          src={imageUrl} 
          alt={name}
          // These classes make it behave like our old Image component
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
          // We add a loading attribute for better performance
          loading="lazy"
        />
        {/* --- END OF FIX --- */}

      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-body font-bold text-lg truncate">{name}</h3>
        <p className="text-xl font-body text-vibrant-magenta font-semibold">₹{price}</p>
        <button className="bg-vibrant-magenta text-white font-body font-bold py-2 px-4 rounded-md hover:bg-deep-red transition-colors w-full mt-2">
          View Details
        </button>
      </div>
      
    </div>
  );
}