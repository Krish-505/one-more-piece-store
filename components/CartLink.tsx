// in components/CartLink.tsx
"use client";
import Link from 'next/link';
import { useCart } from '@/lib/CartContext';
import { ShoppingBag } from 'lucide-react';

export default function CartLink() {
  const { itemCount } = useCart();
  return (
    <Link href="/cart" className="relative text-dark-charcoal hover:text-vibrant-magenta transition-colors">
      <ShoppingBag size={28} />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-vibrant-magenta text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Link>
  );
}