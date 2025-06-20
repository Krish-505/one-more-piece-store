// in components/AdminNav.tsx
import Link from 'next/link';

export default function AdminNav() {
  return (
    <nav className="bg-dark-charcoal text-white p-4 flex gap-6 shadow-md">
      <Link href="/dashboard" className="hover:text-vibrant-magenta font-bold">
        Dashboard
      </Link>
      <Link href="/dashboard/add-product" className="hover:text-vibrant-magenta font-bold">
        Add New Product
      </Link>
      {/* We will add a 'Sign Out' button here later */}
    </nav>
  );
}