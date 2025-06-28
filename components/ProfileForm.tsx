// in components/ProfileForm.tsx
"use client";

import { useState, useRef } from "react";
import { updateUserProfile } from "@/app/actions";
import type { Profile } from "@/types"; // We need to export Profile type from types/index.ts

export default function ProfileForm({ profile }: { profile: Profile | null }) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleFormAction = async (formData: FormData) => {
    setIsSubmitting(true);
    setMessage("Saving...");
    const result = await updateUserProfile(formData);
    if (result.success) {
      setMessage(result.message);
    } else {
      setMessage(`Error: ${result.message}`);
    }
    setIsSubmitting(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Details</h2>
      <form ref={formRef} action={handleFormAction} className="space-y-4 bg-white/30 p-6 rounded-lg shadow-md">
        <div>
          <label htmlFor="full_name" className="block text-sm font-bold mb-1">Full Name</label>
          <input type="text" id="full_name" name="full_name" defaultValue={profile?.full_name || ''} required className="w-full p-2 ..."/>
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-bold mb-1">Phone Number</label>
          <input type="tel" id="phone" name="phone" defaultValue={profile?.phone || ''} required className="w-full p-2 ..."/>
        </div>
        <div>
          <label htmlFor="address_line" className="block text-sm font-bold mb-1">Address</label>
          <textarea id="address_line" name="address_line" defaultValue={profile?.address_line || ''} rows={3} className="w-full p-2 ..."></textarea>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="district" className="block text-sm font-bold mb-1">District</label>
            <input type="text" id="district" name="district" defaultValue={profile?.district || ''} className="w-full p-2 ..."/>
          </div>
          <div>
            <label htmlFor="pincode" className="block text-sm font-bold mb-1">Pincode</label>
            <input type="text" id="pincode" name="pincode" defaultValue={profile?.pincode || ''} className="w-full p-2 ..."/>
          </div>
        </div>
        <div>
          <label htmlFor="alt_phone" className="block text-sm font-bold mb-1">Alt. Phone (Optional)</label>
          <input type="tel" id="alt_phone" name="alt_phone" defaultValue={profile?.alt_phone || ''} className="w-full p-2 ..."/>
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full bg-vibrant-magenta ... disabled:bg-gray-400">
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
        {message && <p className="mt-2 text-center font-bold">{message}</p>}
      </form>
    </div>
  );
}