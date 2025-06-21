// in app/dashboard/edit-product/[id]/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import type { Product } from '@/types'; // We'll create this file next

// The 'params' prop is automatically passed by Next.js for dynamic routes
export default function EditProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Partial<Product>>({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const supabase = createClient();
  const productId = params.id;

  // Use useCallback to memoize the function
  const fetchProduct = useCallback(async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single(); // .single() fetches one record instead of an array

    if (error) {
      setMessage(`Error fetching product: ${error.message}`);
    } else if (data) {
      setProduct(data);
    }
    setLoading(false);
  }, [supabase, productId]);

  // Fetch the product data when the component mounts
  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('Updating...');

    const { name, description, price, category, size, status } = product;

    const { error } = await supabase
      .from('products')
      .update({ name, description, price: Number(price), category, size, status })
      .eq('id', productId);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Product updated successfully!');
      setTimeout(() => router.push('/dashboard'), 1500);
    }
  };

  if (loading) {
    return <div className="p-8">Loading product data...</div>;
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white/20 p-6 rounded-lg shadow-md">
        <div>
          <label htmlFor="name" className="block text-sm font-bold mb-1">Product Name</label>
          <input type="text" id="name" name="name" value={product.name || ''} onChange={handleChange} required className="w-full p-2 border border-gray-400 rounded-md text-dark-charcoal" />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-bold mb-1">Description</label>
          <textarea id="description" name="description" value={product.description || ''} onChange={handleChange} rows={4} className="w-full p-2 border border-gray-400 rounded-md text-dark-charcoal" />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-bold mb-1">Price (₹)</label>
          <input type="number" id="price" name="price" value={product.price || ''} onChange={handleChange} required className="w-full p-2 border border-gray-400 rounded-md text-dark-charcoal" />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-bold mb-1">Category</label>
          <input type="text" id="category" name="category" value={product.category || ''} onChange={handleChange} required className="w-full p-2 border border-gray-400 rounded-md text-dark-charcoal" />
        </div>
        <div>
          <label htmlFor="size" className="block text-sm font-bold mb-1">Size</label>
          <input type="text" id="size" name="size" value={product.size || ''} onChange={handleChange} className="w-full p-2 border border-gray-400 rounded-md text-dark-charcoal" />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-bold mb-1">Status</label>
          <input type="text" id="status" name="status" value={product.status || ''} onChange={handleChange} required className="w-full p-2 border border-gray-400 rounded-md text-dark-charcoal" />
        </div>
        <button type="submit" className="w-full bg-vibrant-magenta text-white py-3 rounded-md font-bold hover:bg-deep-red transition-colors">
          Update Product
        </button>
        {message && <p className="mt-4 text-center font-bold">{message}</p>}
      </form>
    </div>
  );
}