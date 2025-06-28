// in components/CheckoutForm.tsx
"use client";

import { useCart } from "@/lib/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { placeOrder } from "@/app/actions";
import type { Product, Profile, CartItem } from "@/types";

type CheckoutFormProps = {
  initialProfile: Partial<Profile> & { email?: string } | null;
  buyNowProduct: Product | null;
};

export default function CheckoutForm({ initialProfile, buyNowProduct }: CheckoutFormProps) {
  const { cartItems: mainCartItems, totalPrice: mainCartTotal, clearCart } = useCart();
  const router = useRouter();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  
  const isBuyNowMode = !!buyNowProduct;
  const itemsForCheckout = isBuyNowMode ? [{ product: buyNowProduct! }] : mainCartItems;
  const totalForCheckout = isBuyNowMode ? buyNowProduct!.price : mainCartTotal;
  
  const handleFormAction = async (formData: FormData) => {
    setIsSubmitting(true);
    setMessage("Placing your order...");
    const result = await placeOrder(formData, itemsForCheckout, totalForCheckout);
    if (result.success) {
      setMessage("Order placed successfully! Thank you!");
      if (!isBuyNowMode) clearCart();
      setTimeout(() => router.push('/'), 3000);
    } else {
      setMessage(`Error: ${result.message}`);
      setIsSubmitting(false);
    }
  };

  return (
    <form action={handleFormAction} className="space-y-6 bg-white/30 p-8 rounded-lg shadow-md">
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-heading border-b border-dark-charcoal/30 pb-2">Contact Information</h2>
        <div>
          <label htmlFor="customer_name" className="block text-sm font-bold mb-1">Full Name</label>
          <input type="text" id="customer_name" name="customer_name" defaultValue={initialProfile?.full_name || ''} required className="w-full p-3 border border-gray-400 rounded-md text-dark-charcoal"/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="customer_email" className="block text-sm font-bold mb-1">Email</label>
            <input type="email" id="customer_email" name="customer_email" defaultValue={initialProfile?.email || ''} required className="w-full p-3 border border-gray-400 rounded-md text-dark-charcoal" />
          </div>
          <div>
            <label htmlFor="customer_phone" className="block text-sm font-bold mb-1">Phone Number</label>
            <input type="tel" id="customer_phone" name="customer_phone" defaultValue={initialProfile?.phone || ''} required className="w-full p-3 border border-gray-400 rounded-md text-dark-charcoal"/>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-heading border-b border-dark-charcoal/30 pb-2">Shipping Address</h2>
        <div>
          <label htmlFor="address_line" className="block text-sm font-bold mb-1">Address (Include City and State)</label>
          <textarea id="address_line" name="address_line" defaultValue={initialProfile?.address_line || ''} required rows={3} className="w-full p-3 border border-gray-400 rounded-md text-dark-charcoal"></textarea>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="district" className="block text-sm font-bold mb-1">District</label>
            <input type="text" id="district" name="district" defaultValue={initialProfile?.district || ''} required className="w-full p-3 border border-gray-400 rounded-md text-dark-charcoal"/>
          </div>
          <div>
            <label htmlFor="pincode" className="block text-sm font-bold mb-1">Pincode</label>
            <input type="text" id="pincode" name="pincode" defaultValue={initialProfile?.pincode || ''} required className="w-full p-3 border border-gray-400 rounded-md text-dark-charcoal"/>
          </div>
        </div>
        <div>
          <label htmlFor="alt_phone" className="block text-sm font-bold mb-1">Alternative Phone No (Optional)</label>
          <input type="tel" id="alt_phone" name="alt_phone" defaultValue={initialProfile?.alt_phone || ''} className="w-full p-3 border border-gray-400 rounded-md text-dark-charcoal"/>
        </div>
      </div>
      <div className="border-t-2 border-dark-charcoal pt-6 space-y-4">
        <div className="flex justify-between text-xl font-bold">
          <h2>Order Total:</h2>
          <p>₹{totalForCheckout.toFixed(2)}</p>
        </div>
        <button type="submit" disabled={isSubmitting || itemsForCheckout.length === 0} className="w-full bg-vibrant-magenta text-white py-3 rounded-md font-bold text-lg hover:bg-deep-red transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
          {isSubmitting ? 'Placing Order...' : 'Place Order'}
        </button>
        {message && <p className="mt-4 text-center font-bold text-lg">{message}</p>}
      </div>
    </form>
  );
}