// in components/ProfileForm.tsx
"use client";

import { useState } from "react";
import type { Profile } from "@/types";
import { updateProfile } from "@/app/actions";

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormAction = async (formData: FormData) => {
    setIsSubmitting(true);
    const result = await updateProfile(formData);
    if (result.success) {
      setMessage(result.message);
    } else {
      setMessage(`Error: ${result.message}`);
    }
    setIsSubmitting(false);
  };

  return (
    <form action={handleFormAction} className="space-y-4 bg-white/30 p-6 rounded-lg shadow-md">
      <div>
        <label htmlFor="full_name" className="block text-sm font-bold mb-1">Full Name</label>
        <input type="text" id="full_name" name="full_name" defaultValue={profile.full_name || ''} required className="w-full p-2 border border-gray-400 rounded-md text-dark-charcoal" />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-bold mb-1">Phone Number</label>
        <input type="tel" id="phone" name="phone" defaultValue={profile.phone || ''} required className="w-full p-2 border border-gray-400 rounded-md text-dark-charcoal" />
      </div>
      <div>
        <label htmlFor="address_line" className="block text-sm font-bold mb-1">Address</label>
        <textarea id="address_line" name="address_line" defaultValue={profile.address_line || ''} rows={3} required className="w-full p-2 border border-gray-400 rounded-md text-dark-charcoal" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="district" className="block text-sm font-bold mb-1">District</label>
          <input type="text" id="district" name="district" defaultValue={profile.district || ''} required className="w-full p-2 border border-gray-400 rounded-md text-dark-charcoal" />
        </div>
        <div>
          <label htmlFor="pincode" className="block text-sm font-bold mb-1">Pincode</label>
          <input type="text" id="pincode" name="pincode" defaultValue={profile.pincode || ''} required className="w-full p-2 border border-gray-400 rounded-md text-dark-charcoal" />
        </div>
      </div>
       <div>
        <label htmlFor="alt_phone" className="block text-sm font-bold mb-1">Alt. Phone (Optional)</label>
        <input type="tel" id="alt_phone" name="alt_phone" defaultValue={profile.alt_phone || ''} className="w-full p-2 border border-gray-400 rounded-md text-dark-charcoal" />
      </div>
      <button type="submit" disabled={isSubmitting} className="w-full bg-vibrant-magenta text-white py-2 rounded-md font-bold hover:bg-deep-red transition-colors disabled:bg-gray-400">
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </button>
      {message && <p className="mt-2 text-center text-sm font-bold">{message}</p>}
    </form>
  );
}