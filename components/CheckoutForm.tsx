// in components/CheckoutForm.tsx
"use client";

import { useCart } from "@/lib/CartContext";
import { placeOrder } from "@/app/actions";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { Profile } from "@/types";
import type { User } from "@supabase/supabase-js"; // Import the User type

export default function CheckoutForm({ profile, user }: { profile: Profile | null, user: User | null }) {
  const { cartItems, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  
  // Initialize the form state with data from the user's profile if it exists
  const [formData, setFormData] = useState({
    customer_name: profile?.full_name || '',
    // If the user is logged in, use their email. Otherwise, it's an empty string for guests.
    customer_email: user?.email || '',
    customer_phone: profile?.phone || '',
    address_line: profile?.address_line || '',
    district: profile?.district || '',
    pincode: profile?.pincode || '',
    alt_phone: profile?.alt_phone || '',
  });
  
  // This effect handles the case where the cart becomes empty while on the checkout page
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/');
    }
  }, [cartItems, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("Placing your order...");
    
    const data = new FormData(e.currentTarget);
    const result = await placeOrder(data, cartItems, totalPrice);
    
    if (result.success) {
      setMessage("Order placed successfully! Thank you!");
      clearCart();
      setTimeout(() => router.push('/'), 3000);
    } else {
      setMessage(`Error: ${result.message}`);
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto max-w-2xl p-4 md:p-8">
      <h1 className="text-3xl font-heading mb-8 text-center">Checkout</h1>
      <form onSubmit={handleFormSubmit} className="space-y-8 bg-white/30 p-8 rounded-lg shadow-md">
        
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-heading border-b border-dark-charcoal/30 pb-2">Contact Information</h2>
          <div>
            <label htmlFor="customer_name" className="block text-sm font-bold mb-1">Full Name</label>
            <input type="text" id="customer_name" name="customer_name" value={formData.customer_name} onChange={handleChange} required className="w-full p-3 border border-gray-400 rounded-md text-dark-charcoal" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="customer_email" className="block text-sm font-bold mb-1">Email</label>
              <input type="email" id="customer_email" name="customer_email" value={formData.customer_email} onChange={handleChange} required className="w-full p-3 border border-gray-400 rounded-md text-dark-charcoal" />
            </div>
            <div>
              <label htmlFor="customer_phone" className="block text-sm font-bold mb-1">Phone Number</label>
              <input type="tel" id="customer_phone" name="customer_phone" value={formData.customer_phone} onChange={handleChange} required className="w-full p-3 border border-gray-400 rounded-md text-dark-charcoal" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold font-heading border-b border-dark-charcoal/30 pb-2">Shipping Address</h2>
          <div>
            <label htmlFor="address_line" className="block text-sm font-bold mb-1">Address (Include City and State)</label>
            <textarea id="address_line" name="address_line" value={formData.address_line} onChange={handleChange} required rows={3} className="w-full p-3 border border-gray-400 rounded-md text-dark-charcoal"></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="district" className="block text-sm font-bold mb-1">District</label>
              <input type="text" id="district" name="district" value={formData.district} onChange={handleChange} required className="w-full p-3 border border-gray-400 rounded-md text-dark-charcoal" />
            </div>
            <div>
              <label htmlFor="pincode" className="block text-sm font-bold mb-1">Pincode</label>
              <input type="text" id="pincode" name="pincode" value={formData.pincode} onChange={handleChange} required className="w-full p-3 border border-gray-400 rounded-md text-dark-charcoal" />
            </div>
          </div>
          <div>
            <label htmlFor="alt_phone" className="block text-sm font-bold mb-1">Alternative Phone No (Optional)</label>
            <input type="tel" id="alt_phone" name="alt_phone" value={formData.alt_phone} onChange={handleChange} className="w-full p-3 border border-gray-400 rounded-md text-dark-charcoal" />
          </div>
        </div>
        
        <div className="border-t-2 border-dark-charcoal pt-6 space-y-4">
          <div className="flex justify-between text-xl font-bold">
            <h2>Order Total:</h2>
            <p>₹{totalPrice.toFixed(2)}</p>
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-vibrant-magenta text-white py-3 rounded-md font-bold text-lg hover:bg-deep-red transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
            {isSubmitting ? 'Placing Order...' : 'Place Order'}
          </button>
          {message && <p className="mt-4 text-center font-bold text-lg">{message}</p>}
        </div>
      </form>
    </div>
  );
}