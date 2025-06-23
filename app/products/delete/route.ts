// in app/api/products/delete/route.ts

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // 1. Get the productId from the request body
  const { productId } = await request.json();

  if (!productId) {
    return new NextResponse(JSON.stringify({ message: "Product ID is required." }), { status: 400 });
  }

  // 2. Create an authenticated Supabase client
  const cookieStore = cookies();
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

  // 3. Check if the user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return new NextResponse(JSON.stringify({ message: "Not authenticated." }), { status: 401 });
  }

  // 4. Get image URLs to delete from Storage first
  const { data: product } = await supabase.from('products').select('image_url').eq('id', productId).single();
  if (product?.image_url && Array.isArray(product.image_url)) {
    const fileNames = product.image_url.map(url => url.split('/').pop()).filter(Boolean) as string[];
    if (fileNames.length > 0) {
      await supabase.storage.from('product-images').remove(fileNames);
    }
  }

  // 5. Delete the product from the database
  const { error } = await supabase.from('products').delete().match({ id: productId });

  if (error) {
    return new NextResponse(JSON.stringify({ message: `Database error: ${error.message}` }), { status: 500 });
  }

  // 6. Return a success response
  return NextResponse.json({ success: true, message: "Product deleted successfully." });
}