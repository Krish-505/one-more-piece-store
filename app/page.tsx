// in app/page.tsx
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

type Product = {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
};

export default async function HomePage() {
  // THIS IS THE FIX: We must 'await' the cookies() function.
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {}
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {}
        },
      },
    }
  );

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'Available')
    .order('created_at', { ascending: false });

  if (error) console.error('Error fetching products:', error);

  return (
    <main className="container mx-auto p-4 md:p-8">
      <header className="flex flex-col items-center text-center gap-4 mb-12">
        <Image src="/logo.png" alt="One More Piece Logo" width={150} height={150} />
        <p className="max-w-md font-body">
          Handpicked Thrift & Surplus clothing. Unique pieces, one at a time.
        </p>
      </header>

      <section>
        <h2 className="text-2xl text-center mb-8">LATEST DROP</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.map((product: Product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.price}
              imageUrl={product.image_url || '/placeholder.svg'}
            />
          ))}
        </div>
      </section>
    </main>
  );
}