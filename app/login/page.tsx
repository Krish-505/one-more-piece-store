// in app/login/page.tsx
"use client";

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

export default function LoginPage() {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const router = useRouter();

  useEffect(() => {
    const client = createClient();
    setSupabase(client);

    const checkSessionAndListen = async () => {
      const { data: { session } } = await client.auth.getSession();
      if (session) {
        // THIS IS THE UPDATED LINE
        router.push('/dashboard'); // Redirect to the new, simplified route
        return;
      }

      const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
        if (session) {
          // THIS IS THE UPDATED LINE
          router.push('/dashboard'); // Redirect to the new, simplified route
        }
      });

      return () => {
        subscription?.unsubscribe();
      };
    };

    checkSessionAndListen();
  }, [router]);

  if (!supabase) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-sm p-8 bg-white/30 rounded-lg shadow-md">
        <h1 className="text-2xl text-center mb-6">Admin Login</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="dark"
          providers={[]}
        />
      </div>
    </div>
  );
}