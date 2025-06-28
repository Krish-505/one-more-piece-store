// in components/AddToCartButton.tsx
"use client";

import { useCart } from "@/lib/CartContext";
import type { Product } from "@/types";
import { useRouter } from "next/navigation";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart, isInCart } = useCart();
  const router = useRouter();
  const alreadyInCart = isInCart(product.id);

  const handleAddToCart = () => {
    addToCart(product);
    alert(`${product.name} has been added to your cart!`);
  };

  const handleBuyNow = () => {
    const checkoutUrl = `/checkout?buyNow=true&productId=${product.id}`;
    router.push(checkoutUrl);
  };

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={handleAddToCart}
        disabled={alreadyInCart}
        className="w-full bg-vibrant-magenta text-white py-4 rounded-md font-bold text-lg hover:bg-deep-red transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        {alreadyInCart ? 'In Cart' : 'Add to Cart'}
      </button>
      
      <button
        onClick={handleBuyNow}
        className="w-full bg-white text-dark-charcoal border-2 border-dark-charcoal py-4 rounded-md font-bold text-lg hover:bg-dark-charcoal hover:text-white transition-colors"
      >
        Buy Now
      </button>
    </div>
  );
}