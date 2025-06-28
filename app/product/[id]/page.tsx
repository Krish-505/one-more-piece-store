// in app/product/[id]/page.tsx
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import type { Product } from '@/types';
import ProductImageCarousel from '@/components/ProductImageCarousel';
import AddToCartButton from '@/components/AddToCartButton';

// Helper function to fetch a single product from the database
async function getProduct(id: string): Promise<Product | null> {
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

  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
  
  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }
  return data;
}

// The main page component
export default async function ProductDetailPage({ params: { id } }: { params: { id: string } }) {
  // Now we can use 'id' directly without the warning.
  const product = await getProduct(id);

  if (!product || !product.image_url || product.image_url.length === 0) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-6xl p-4 md:p-8 pb-32 md:pb-8">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start">
        
        {/* Column 1: Image Gallery */}
        <div className="md:sticky md:top-28">
          <ProductImageCarousel slides={product.image_url ?? []} options={{ loop: true }} />
        </div>

        {/* Column 2: Product Details */}
        <div className="flex flex-col">
          <h1 className="text-3xl lg:text-5xl font-heading mb-4 text-dark-charcoal">{product.name}</h1>
          <p className="text-2xl lg:text-3xl font-body text-vibrant-magenta font-semibold mb-6">₹{product.price}</p>
          
          {/* Size Display */}
          {product.size && (
            <div className="mb-6">
              <h2 className="text-sm uppercase font-bold text-gray-500 tracking-wider">Size</h2>
              <div className="mt-2 flex items-center justify-center w-12 h-12 border-2 border-dark-charcoal rounded-md">
                <span className="font-bold text-lg">{product.size}</span>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="prose text-dark-charcoal max-w-none mb-8">
            <h2 className="text-sm uppercase font-bold text-gray-500 tracking-wider">Description</h2>
            <p className="mt-2">{product.description || "No description available."}</p>
          </div>
          
          {/* Add to Cart Button for Desktop */}
          <div className="hidden md:block mt-auto pt-8">
             <AddToCartButton product={product} />
          </div>
        </div>
      </div>

      {/* Sticky Add to Cart Button (Only for mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-warm-beige/80 backdrop-blur-sm border-t-2 border-dark-charcoal z-10">
        <div className="container mx-auto">
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}