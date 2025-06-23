// in app/page.tsx
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Product } from '@/types'; // Let's use our shared type

export default async function HomePage() {
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

  // --- NEW DATA FETCHING LOGIC ---

  // 1. Fetch AVAILABLE products (same as before)
  const { data: availableProducts, error: availableError } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'Available')
    .order('created_at', { ascending: false });

  // 2. Fetch SOLD products
  const { data: soldProducts, error: soldError } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'Sold')
    .order('created_at', { ascending: false })
    .limit(4); // Let's just show the 4 most recently sold items

  if (availableError || soldError) {
    console.error('Error fetching products:', availableError || soldError);
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
     
      {/* --- Section 1: Available Products --- */}
      <section>
        <h2 className="text-2xl text-center mb-8">LATEST DROP</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {availableProducts?.map((product: Product) => (
            // We pass the product and a disabled flag to the ProductCard
            <ProductCard
              key={product.id}
              product={product}
              disabled={false}
            />
          ))}
        </div>
      </section>

      {/* --- NEW Section 2: Recently Sold Products --- */}
      {soldProducts && soldProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl text-center mb-8 text-red-500">RECENTLY SOLD</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {soldProducts.map((product: Product) => (
              // We pass the product and a disabled flag to the ProductCard
              <ProductCard
                key={product.id}
                product={product}
                disabled={true}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}