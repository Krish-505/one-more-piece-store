// in app/dashboard/page.tsx
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import ProductTable from '@/components/ProductTable'; // <-- Import our new component

// This remains a Server Component for fast initial load
export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options: CookieOptions) { try { cookieStore.set({ name, value, ...options }); } catch (error) {} },
        remove(name: string, options: CookieOptions) { try { cookieStore.set({ name, value: '', ...options }); } catch (error) {} },
      },
    }
  );

  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, price, category, status')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products for dashboard:', error.message);
    return <p>Error loading products.</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Product Dashboard</h1>
      {/* We render the client component, passing the server-fetched data as a prop */}
      <ProductTable initialProducts={products || []} />
    </div>
  );
}