// in app/dashboard/add-product/page.tsx
"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import type { SupabaseClient } from '@supabase/supabase-js';

export default function AddProductPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [size, setSize] = useState('');
  const [message, setMessage] = useState('');
  
  // NEW: State to hold the selected image file
  const [imageFile, setImageFile] = useState<File | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('Submitting...');

    if (!imageFile) {
      setMessage('Please select an image to upload.');
      return;
    }

    // 1. UPLOAD THE IMAGE
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`; // Create a random file name
    const { error: uploadError } = await supabase.storage
      .from('product-images') // Your bucket name
      .upload(fileName, imageFile);

    if (uploadError) {
      setMessage(`Error uploading image: ${uploadError.message}`);
      return;
    }

    // 2. GET THE PUBLIC URL OF THE UPLOADED IMAGE
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);
    
    const publicUrl = urlData.publicUrl;

    // 3. INSERT PRODUCT DATA (including the image URL) INTO THE DATABASE
    const { error: insertError } = await supabase
      .from('products')
      .insert([
        { name, description, price: Number(price), category, size, image_url: publicUrl },
      ])
      .select();

    if (insertError) {
      setMessage(`Error adding product: ${insertError.message}`);
    } else {
      setMessage('Product added successfully!');
      // Clear form and state
      setName('');
      setDescription('');
      setPrice('');
      setCategory('');
      setSize('');
      setImageFile(null);
      (document.getElementById('image') as HTMLInputElement).value = ""; // Reset file input
      setTimeout(() => router.push('/dashboard'), 2000);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white/20 p-6 rounded-lg shadow-md">
        {/* ... other form fields ... */}
        <div>
          <label htmlFor="name" className="block text-sm font-bold mb-1">Product Name</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-2 border border-gray-400 rounded-md text-dark-charcoal" />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-bold mb-1">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full p-2 border border-gray-400 rounded-md text-dark-charcoal" />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-bold mb-1">Price (₹)</label>
          <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full p-2 border border-gray-400 rounded-md text-dark-charcoal" />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-bold mb-1">Category</label>
          <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full p-2 border border-gray-400 rounded-md text-dark-charcoal" />
        </div>
        <div>
          <label htmlFor="size" className="block text-sm font-bold mb-1">Size</label>
          <input type="text" id="size" value={size} onChange={(e) => setSize(e.target.value)} className="w-full p-2 border border-gray-400 rounded-md text-dark-charcoal" />
        </div>

        {/* NEW: File Input for Image */}
        <div>
          <label htmlFor="image" className="block text-sm font-bold mb-1">Product Image</label>
          <input type="file" id="image" onChange={handleImageSelect} accept="image/png, image/jpeg" required className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-vibrant-magenta file:text-white hover:file:bg-deep-red" />
        </div>
        
        <button type="submit" className="w-full bg-vibrant-magenta text-white py-3 rounded-md font-bold hover:bg-deep-red transition-colors">
          Add Product
        </button>
        {message && <p className="mt-4 text-center font-bold">{message}</p>}
      </form>
    </div>
  );
}