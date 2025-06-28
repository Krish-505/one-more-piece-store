// in app/checkout/page.tsx
import { createSupabaseServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import CheckoutForm from '@/components/CheckoutForm';
import type { Product, Profile } from '@/types';

export default async function CheckoutPage({ 
  searchParams: { buyNow, productId } 
}: { 
  searchParams: { buyNow?: string; productId?: string; } 
}) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile: (Profile & { email?: string }) | null = null;
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    profile = data ? { ...data, email: user.email } : null;
  }
  
   const isBuyNowMode = buyNow === 'true';
  let buyNowProduct: Product | null = null;

  if (isBuyNowMode && productId) {
    const { data } = await supabase.from('products').select('*').eq('id', productId).single();
    if (!data) return redirect('/');
    buyNowProduct = data;
  }

  return (
    <div className="container mx-auto max-w-2xl p-4 md:p-8">
      <h1 className="text-3xl font-heading mb-8 text-center">Checkout</h1>
      <CheckoutForm 
        initialProfile={profile} 
        buyNowProduct={buyNowProduct}
      />
    </div>
  );
}