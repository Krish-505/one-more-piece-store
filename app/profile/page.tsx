// in app/profile/page.tsx
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '../../utils/supabase/server';
import ProfileForm from '@/components/ProfileForm';
// --- CORRECTED IMPORT ---
// We now import all our consistent types from one place
import type { Order, Profile } from '@/types';

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch both profile and orders data
  const profileResult = await supabase.from('profiles').select('*').eq('id', user.id).single();
  const ordersResult = await supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
  
  // Use our master types for type safety
  const profile: Profile | null = profileResult.data;
  const orders: Order[] = ordersResult.data || [];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-heading mb-8 text-center md:text-left">My Profile</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
        
        <div className="lg:col-span-1">
          <ProfileForm profile={profile} />
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">My Order History</h2>
          <div className="space-y-6">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div key={order.id} className="bg-white/30 p-4 rounded-lg shadow-md">
                  <div className="flex justify-between items-center border-b border-dark-charcoal/20 pb-3 mb-3">
                    <div>
                      <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">Order Placed</p>
                      <p className="font-semibold">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-bold uppercase tracking-wider text-right">Total</p>
                      <p className="font-bold text-lg text-vibrant-magenta">₹{order.order_total.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <h3 className="font-bold mb-2">Items:</h3>
                  <div className="space-y-3">
                    {/* The ?.map() is a safety check in case ordered_products is null */}
                    {order.ordered_products?.map((item, index) => (
                      <div key={item.id || index} className="flex items-center gap-4">
                        <img 
                          src={item.image_url || '/placeholder.svg'} 
                          alt={item.name} 
                          className="w-16 h-16 object-cover rounded-md border-2 border-white/50"
                        />
                        <div className="flex-grow">
                          <p className="font-semibold">{item.name}</p>
                        </div>
                        <div className="text-right">
                          {/* This check prevents the 'NaN' error */}
                          {typeof item.price === 'number' ? (
                            <p className="font-semibold">₹{item.price.toFixed(2)}</p>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white/30 p-8 rounded-lg shadow-md text-center">
                <p>You have not placed any orders yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}