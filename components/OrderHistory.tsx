// in components/OrderHistory.tsx
import type { Order } from '@/types';

export default function OrderHistory({ orders }: { orders: Order[] | null }) {
  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white/30 p-6 rounded-lg shadow-md text-center">
        <p>You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="bg-white/30 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center border-b border-dark-charcoal/30 pb-2 mb-4">
            <div>
              <p className="text-sm text-gray-600">Order Placed</p>
              <p className="font-bold">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="font-bold">₹{order.order_total.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-mono text-xs">#{order.id}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold mb-2">Items:</h3>
            <ul className="space-y-2">
              {order.ordered_products.map(item => (
                <li key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} (x{item.quantity})</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}