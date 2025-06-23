// in components/Header.tsx
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-warm-beige w-full py-4 px-8 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Store Name */}
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="One More Piece Logo" className="h-14 w-14" />
          <span className="font-heading text-xl text-dark-charcoal hidden sm:block">
            One More Piece
          </span>
        </Link>
        
        {/* Navigation / Actions */}
        <nav className="flex items-center gap-6">
          <Link href="/cart" className="font-bold text-dark-charcoal hover:text-vibrant-magenta transition-colors">
            Cart (0)
          </Link>
          {/* We can add a user login link here later */}
        </nav>
      </div>
    </header>
  );
}