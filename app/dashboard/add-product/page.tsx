// in app/dashboard/add-product/page.tsx
"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { CATEGORIES } from '@/types';

export default function AddProductPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [size, setSize] = useState('');
  const [message, setMessage] = useState('');
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(e.target.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('Submitting...');

    if (!imageFiles || imageFiles.length === 0) {
      setMessage('Please select at least one image.');
      return;
    }

    const imageUrls: string[] = [];
    for (const file of Array.from(imageFiles)) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) {
        setMessage(`Error uploading image ${file.name}: ${uploadError.message}`);
        return;
      }
      
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);
      
      imageUrls.push(urlData.publicUrl);
    }

    const { error: insertError } = await supabase
      .from('products')
      .insert([
        { name, description, price: Number(price), category, size, image_url: imageUrls, status: 'Available' },
      ]);

    if (insertError) {
      setMessage(`Error adding product: ${insertError.message}`);
    } else {
      setMessage('Product added successfully!');
      // Reset form fields
      setName('');
      setDescription('');
      setPrice('');
      setCategory('');
      setSize('');
      setImageFiles(null);
      // It's a bit tricky to programmatically clear a file input, so we'll leave it
      
      setTimeout(() => router.push('/dashboard'), 2000);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white/20 p-6 rounded-lg shadow-md">
        
        {/* --- ALL THE MISSING FORM FIELDS ARE HERE --- */}
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
  {/* Replace the input with this select dropdown */}
  <select 
    id="category" 
    name="category" 
    value={category} 
    onChange={(e) => setCategory(e.target.value)} 
    required 
    className="w-full p-2 border border-gray-400 rounded-md text-dark-charcoal"
  >
    <option value="" disabled>Select a category</option>
    {CATEGORIES.map(cat => (
      <option key={cat} value={cat}>{cat}</option>
    ))}
  </select>
</div>
        <div>
          <label htmlFor="size" className="block text-sm font-bold mb-1">Size</label>
          <input type="text" id="size" value={size} onChange={(e) => setSize(e.target.value)} className="w-full p-2 border border-gray-400 rounded-md text-dark-charcoal" />
        </div>

        {/* --- THE CORRECTED FILE INPUT --- */}
        <div>
          <label htmlFor="images" className="block text-sm font-bold mb-1">Product Images</label>
          <input 
            type="file" 
            id="images" 
            name="images"
            onChange={handleImageSelect} 
            accept="image/png, image/jpeg" 
            required 
            multiple // This 'multiple' attribute is what allows selecting more than one file
            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-vibrant-magenta file:text-white hover:file:bg-deep-red"
          />
        </div>
        
        <button type="submit" className="w-full bg-vibrant-magenta text-white py-3 rounded-md font-bold hover:bg-deep-red transition-colors">
          Add Product
        </button>
        {message && <p className="mt-4 text-center font-bold">{message}</p>}
      </form>
    </div>
  );
}