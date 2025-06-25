// in components/AddToCartButton.tsx
"use client";

import { useCart } from "@/lib/CartContext";
import type { Product } from "@/types";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart, isInCart } = useCart();
  const alreadyInCart = isInCart(product.id);

  return (
    <button
      onClick={() => addToCart(product)}
      disabled={alreadyInCart}
      className="w-full bg-vibrant-magenta text-white py-4 ... disabled:bg-gray-500 disabled:cursor-not-allowed"
    >
      {alreadyInCart ? 'In Cart' : 'Add to Cart'}
    </button>
  );
}