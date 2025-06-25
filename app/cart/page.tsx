// in app/cart/page.tsx
"use client";

import { useCart } from "@/lib/CartContext";
import Link from "next/link";
import Image from "next/image"; // We'll use Next/Image for the small thumbnails

export default function CartPage() {
  const { cartItems, removeFromCart, itemCount, totalPrice } = useCart();

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <h1 className="text-3xl font-heading mb-8">Your Cart</h1>

      {/* Check if the cart is empty */}
      {itemCount === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl mb-4">Your cart is currently empty.</p>
          <Link href="/" className="bg-vibrant-magenta text-white py-3 px-6 rounded-md font-bold hover:bg-deep-red transition-colors">
            Continue Shopping
          </Link>
        </div>
      ) : (
        // If the cart has items, display them
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Side: Cart Items */}
          <div className="md:col-span-2 space-y-4">
                {cartItems.map(item => (
                  <div key={item.product.id} className="flex items-center gap-4 bg-white/30 p-4 rounded-lg shadow-md">
                    <div className="w-24 h-24 flex-shrink-0">
                      <img 
                    src={Array.isArray(item.product.image_url) ? item.product.image_url[0] : '/placeholder.svg'}
                    alt={item.product.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                    </div>
                    <div className="flex-grow">
                      <h2 className="font-bold text-lg">{item.product.name}</h2>
                      <p className="text-vibrant-magenta font-semibold">₹{item.product.price}</p>
                      {/* Quantity controls are now REMOVED */}
                    </div>
                    <button onClick={() => removeFromCart(item.product.id)} className="font-bold text-red-500 hover:text-red-700 text-2xl">
                      ×
                    </button>
                  </div>
                ))}
              </div>

          {/* Right Side: Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white/30 p-6 rounded-lg shadow-md sticky top-28">
              <h2 className="text-xl font-bold border-b-2 border-dark-charcoal pb-2 mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-bold">₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span>Shipping</span>
                <span className="font-bold">FREE</span>
              </div>
              <div className="flex justify-between font-bold text-xl border-t-2 border-dark-charcoal pt-4 mt-4">
                <span>Total</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <Link 
                    href="/checkout"
                    className="block text-center w-full mt-6 bg-vibrant-magenta text-white py-3 rounded-md font-bold hover:bg-deep-red transition-colors"
                  >
                    Proceed to Checkout
                  </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}