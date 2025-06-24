// in components/Header.tsx
"use client";

import Link from 'next/link';
import { useCart } from '@/lib/CartContext';
import { ShoppingBag } from 'lucide-react'; // <-- Import the icon

export default function Header() {
  const { itemCount } = useCart();

  return (
    <header className="...">
      <div className="container mx-auto flex justify-between items-center">
       <Link href="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="One More Piece Logo" className="h-14 w-14" />
          <span className="font-heading text-xl text-dark-charcoal hidden sm:block">
            One More Piece
          </span>
        </Link>
        
        <nav className="...">
          <Link href="/cart" className="relative text-dark-charcoal hover:text-vibrant-magenta transition-colors">
            <ShoppingBag size={28} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-vibrant-magenta text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}