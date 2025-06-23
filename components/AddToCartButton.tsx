// in components/AddToCartButton.tsx
"use client";


import { useCart } from "@/lib/CartContext";
import type { Product } from "@/types";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    alert(`${product.name} has been added to your cart!`);
  };

  return (
    <button
      onClick={handleAddToCart}
      className="w-full bg-vibrant-magenta text-white py-4 rounded-md font-bold text-lg hover:bg-deep-red transition-colors"
    >
      Add to Cart
    </button>
  );
}