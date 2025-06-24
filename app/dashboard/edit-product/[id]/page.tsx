"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { Product } from '@/types';
import { editProduct } from '@/app/actions';
import { createClient } from '@/lib/supabaseClient';
import { CATEGORIES } from '@/types'; // <-- Import the categories list

export default function EditProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Partial<Product>>({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const supabase = createClient();
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*').eq('id', params.id).single();
      if (error) setMessage(`Error fetching product: ${error.message}`);
      else if (data) setProduct(data);
      setLoading(false);
    };
    fetchProduct();
  }, [params.id]);

  const handleFormAction = async (formData: FormData) => {
    setIsSubmitting(true);
    setMessage('Updating...');
    const result = await editProduct(Number(params.id), formData);
    if (result.success) {
      setMessage(result.message);
      setTimeout(() => router.push('/dashboard'), 1500);
    } else {
      setMessage(`Error: ${result.message}`);
    }
    setIsSubmitting(false);
  };

  // This function handles changes for ALL form inputs, including our new select
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };
  
  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      <form ref={formRef} action={handleFormAction} className="space-y-4 bg-white/20 p-6 ...">
        <div>
          <label className="block text-sm font-bold mb-1">Current Image(s)</label>
          {Array.isArray(product.image_url) && product.image_url.length > 0 ? (
            <div className="flex gap-2 flex-wrap">
              {product.image_url.map((url, index) => (
                <img key={index} src={url} alt={`${product.name} ${index + 1}`} className="w-24 h-24 object-cover rounded-md" />
              ))}
            </div>
          ) : (<p>No image currently set.</p>)}
        </div>
        
        <div>
          <label htmlFor="newImages" className="block text-sm font-bold mb-1">Upload New Images (replaces all old ones)</label>
          <input type="file" id="newImages" name="newImages" multiple className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-vibrant-magenta file:text-white hover:file:bg-deep-red"/>
        </div>
        
        <div>
          <label htmlFor="name" className="block text-sm font-bold mb-1">Product Name</label>
          <input type="text" id="name" name="name" defaultValue={product.name || ''} required className="w-full p-2 border border-gray-400 rounded-md text-dark-charcoal" />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-bold mb-1">Description</label>
          <textarea id="description" name="description" defaultValue={product.description || ''} rows={4} className="w-full p-2 border border-gray-400 rounded-md text-dark-charcoal" />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-bold mb-1">Price (₹)</label>
          <input type="number" id="price" name="price" defaultValue={product.price || ''} required className="w-full p-2 border border-gray-400 rounded-md text-dark-charcoal" />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-bold mb-1">Category</label>
          <select 
            id="category" 
            name="category" // Use the 'name' attribute for the server action
            value={product.category || ''} // Read value from the 'product' state object
            onChange={handleChange} // Use the unified handleChange function
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
          <input type="text" id="size" name="size" defaultValue={product.size || ''} className="w-full p-2 border border-gray-400 rounded-md text-dark-charcoal" />
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-bold mb-1">Status</label>
          <select id="status" name="status" defaultValue={product.status || 'Available'} required className="w-full p-2 border border-gray-400 rounded-md text-dark-charcoal">
            <option value="Available">Available</option>
            <option value="Sold">Sold</option>
          </select>
        </div>
        
        <button type="submit" disabled={isSubmitting} className="w-full bg-vibrant-magenta text-white py-3 rounded-md font-bold hover:bg-deep-red transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
          {isSubmitting ? 'Updating...' : 'Update Product'}
        </button>
        
        {message && <p className="mt-4 text-center font-bold">{message}</p>}
      </form>
    </div>
  );
}