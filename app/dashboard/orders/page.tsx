// in app/dashboard/orders/page.tsx
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

type OrderedProduct = {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
};

type Order = {
  id: number;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  district: string;
  pincode: string;
  order_total: number;
  ordered_products: OrderedProduct[];
};

// Helper function to fetch orders
async function getOrders(): Promise<Order[]> {
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

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error.message);
    return [];
  }
  return data;
}

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Customer Orders</h1>
      
      {orders.length === 0 ? (
        <p>No orders have been placed yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white/30 p-6 rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-4 mb-4">
                <div>
                  <h2 className="text-sm font-bold text-gray-500">ORDER ID</h2>
                  <p className="font-mono text-sm">{order.id}</p>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-500">DATE PLACED</h2>
                  <p>{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-500">TOTAL</h2>
                  <p className="font-bold text-xl text-vibrant-magenta">₹{order.order_total.toFixed(2)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Details */}
                <div className="space-y-2">
                  <h3 className="font-bold text-lg">Customer & Shipping</h3>
                  <p><strong>Name:</strong> {order.customer_name}</p>
                  <p><strong>Email:</strong> {order.customer_email}</p>
                  <p><strong>Phone:</strong> {order.customer_phone}</p>
                  <p><strong>Address:</strong> {`${order.shipping_address}, ${order.district}, ${order.pincode}`}</p>
                </div>

                                {/* Ordered Products */}
                <div>
                  <h3 className="font-bold text-lg">Products Ordered</h3>
                  {/* --- THIS IS THE UPDATED PART --- */}
                  <div className="space-y-3 mt-2">
                    {order.ordered_products.map(product => (
                      <div key={product.id} className="flex items-center gap-3">
                        <img 
                          src={product.image_url || '/placeholder.svg'} 
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div>
                          <p>{product.name}</p>
                          <p className="text-sm text-gray-600"><strong>₹{product.price}</strong></p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}