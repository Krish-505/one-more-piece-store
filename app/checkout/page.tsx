// in app/checkout/page.tsx
import { createSupabaseServerClient } from "@/utils/supabase/server";
import CheckoutForm from "@/components/CheckoutForm"; 
import type { Profile } from "@/types";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  // Create an authenticated server client
  const supabase = await createSupabaseServerClient();
  
  // Get the current logged-in user, if any
  const { data: { user } } = await supabase.auth.getUser();
  
  let profile: Profile | null = null;
  
  // If a user is logged in, try to fetch their profile data
  if (user) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    profile = profileData;
  }

  // Pass the user's profile (or null if they're not logged in) down to the form component
  // We also pass the user object itself so the form knows if someone is logged in
  return <CheckoutForm profile={profile} user={user} />;
}