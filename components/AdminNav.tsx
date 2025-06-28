// in components/AdminNav.tsx
"use client"; // This component is now interactive

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';

export default function AdminNav() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    // Ask Supabase to sign the user out
    await supabase.auth.signOut();
    // After sign out, force a redirect to the login page
    router.push('/login');
  };

  return (
    <nav className="bg-dark-charcoal text-white p-4 flex justify-between items-center shadow-md">
      {/* Left side links */}
      <div className="flex gap-6">
        <Link href="/dashboard" className="hover:text-vibrant-magenta font-bold">
          Dashboard
        </Link>
        <Link href="/dashboard/add-product" className="hover:text-vibrant-magenta font-bold">
          Add New Product
        </Link>
      </div>
      <Link href="/dashboard/orders" className="hover:text-vibrant-magenta font-bold">
  Orders
</Link>

      {/* Right side sign out button */}
      <div>
        <button 
          onClick={handleSignOut}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}