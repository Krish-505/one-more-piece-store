// in components/Header.tsx
import Link from 'next/link';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import { ShoppingBag, User as UserIcon } from 'lucide-react';
import CartLink from './CartLink'; // We'll create a small client component for the cart
import { logout } from '@/app/actions'; // We'll add a logout server action

export default async function Header() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="bg-warm-beige w-full py-4 px-8 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Store Name */}
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="One More Piece Logo" className="h-14 w-14" />
          <span className="font-heading text-xl text-dark-charcoal hidden sm:block">
            One More Piece
          </span>
        </Link>
        
        {/* Navigation / Actions */}
        <nav className="flex items-center gap-4 md:gap-6">
          <CartLink /> {/* The cart icon needs to be a client component */}
          
          {user ? (
            // If user is logged in
            <>
              <Link href="/profile" className="flex items-center gap-2 font-bold text-dark-charcoal hover:text-vibrant-magenta transition-colors">
                <UserIcon size={24} />
                <span className="hidden sm:inline">Profile</span>
              </Link>
              <form action={logout}>
                <button className="bg-dark-charcoal text-white py-2 px-4 rounded-md font-bold hover:bg-vibrant-magenta transition-colors">
                  Logout
                </button>
              </form>
            </>
          ) : (
            // If user is logged out
            <>
              <Link href="/login" className="font-bold text-dark-charcoal hover:text-vibrant-magenta transition-colors">
                Login
              </Link>
              <Link href="/signup" className="bg-vibrant-magenta text-white py-2 px-4 rounded-md font-bold hover:bg-deep-red transition-colors">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}