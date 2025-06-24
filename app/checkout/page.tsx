// in app/checkout/page.tsx
"use client";

import { useCart } from "@/lib/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { placeOrder } from "@/app/actions"; // We will create this server action next

export default function CheckoutPage() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handlePlaceOrder = async (formData: FormData) => {
    setIsSubmitting(true);
    setMessage("Placing your order...");

    if (cartItems.length === 0) {
      setMessage("Your cart is empty.");
      setIsSubmitting(false);
      return;
    }

    // Call the server action with the form data and cart details
    const result = await placeOrder(formData, cartItems, totalPrice);

    if (result.success) {
      setMessage("Order placed successfully! Thank you!");
      // Clear the cart after a successful order
      clearCart();
      // Redirect to a thank you page or homepage after a delay
      setTimeout(() => router.push('/'), 3000);
    } else {
      setMessage(`Error: ${result.message}`);
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0 && !isSubmitting) {
    return (
      <div className="text-center py-16">
        <p className="text-xl mb-4">Your cart is empty. You can't checkout.</p>
        <button onClick={() => router.push('/')} className="bg-vibrant-magenta text-white py-3 px-6 ...">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl p-4 md:p-8">
      <h1 className="text-3xl font-heading mb-8">Checkout</h1>
      <form action={handlePlaceOrder} className="space-y-6 bg-white/30 p-8 rounded-lg shadow-md">
        <div>
          <label htmlFor="customer_name" className="block text-sm font-bold mb-1">Full Name</label>
          <input type="text" id="customer_name" name="customer_name" required className="w-full p-2 border border-gray-400 rounded-md text-dark-charcoal" />
        </div>
        <div>
          <label htmlFor="customer_email" className="block text-sm font-bold mb-1">Email</label>
          <input type="email" id="customer_email" name="customer_email" required className="w-full p-2 border border-gray-400 rounded-md text-dark-charcoal" />
        </div>
        <div>
              <label htmlFor="customer_phone" className="block text-sm font-bold mb-1">Phone Number</label>
              <input type="tel" id="customer_phone" name="customer_phone" required className="w-full p-2 border border-gray-400 rounded-md text-dark-charcoal" />
            </div>
        <div>
          <label htmlFor="shipping_address" className="block text-sm font-bold mb-1">Shipping Address</label>
          <textarea id="shipping_address" name="shipping_address" required rows={4} className="w-full p-2 border border-gray-400 rounded-md text-dark-charcoal" />
        </div>

        <div className="border-t-2 border-dark-charcoal pt-4">
          <h2 className="text-xl font-bold mb-2">Order Total: ₹{totalPrice.toFixed(2)}</h2>
        </div>
        
        <button type="submit" disabled={isSubmitting} className="w-full bg-vibrant-magenta text-white py-3 rounded-md font-bold hover:bg-deep-red transition-colors disabled:bg-gray-400">
          {isSubmitting ? 'Placing Order...' : 'Place Order'}
        </button>
        {message && <p className="mt-4 text-center font-bold">{message}</p>}
      </form>
    </div>
  );
}