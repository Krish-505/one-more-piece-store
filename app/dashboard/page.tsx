// in app/dashboard/page.tsx
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import ProductTable from '@/components/ProductTable';

// A helper function to create our server client
async function createSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(
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
}

export default async function AdminDashboard() {
  const supabase = await createSupabaseClient();

  // --- We perform two separate data fetches ---

  // 1. Fetch products for the main table (as before)
  const { data: products } = await supabase
    .from('products')
    .select('id, name, price, category, status')
    .order('created_at', { ascending: false });

  // 2. Fetch all orders to calculate total income
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('order_total');

  if (ordersError) {
    console.error("Error fetching orders for analytics:", ordersError.message);
  }

  // --- Analytics Calculations ---
  const totalOrders = orders?.length || 0;
  const totalIncome = orders?.reduce((sum, order) => sum + (order.order_total || 0), 0) || 0;
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* --- Analytics Cards Display --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/30 p-6 rounded-lg shadow-md text-center">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Orders Placed</h3>
          <p className="text-4xl font-bold mt-2">{totalOrders}</p>
        </div>
        <div className="bg-white/30 p-6 rounded-lg shadow-md text-center">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Income</h3>
          <p className="text-4xl font-bold text-green-600 mt-2">₹{totalIncome.toFixed(2)}</p>
        </div>
      </div>
      
      {/* --- The Existing Product Table --- */}
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
      <ProductTable initialProducts={products || []} />
    </div>
  );
}