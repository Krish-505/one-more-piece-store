// in app/profile/page.tsx
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import type { Profile, Order } from "@/types"; // We'll add Order to types
import ProfileForm from "@/components/ProfileForm"; // To edit details
import OrderHistory from "@/components/OrderHistory"; // To show orders

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login'); // Protect this page
  }

  // Fetch user's profile
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  
  // Fetch user's order history
  const { data: orders } = await supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false });

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-heading mb-8">My Profile</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold mb-4">My Details</h2>
          <ProfileForm profile={profile as Profile} />
        </div>
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">My Order History</h2>
          <OrderHistory orders={orders as Order[]} />
        </div>
      </div>
    </div>
  );
}