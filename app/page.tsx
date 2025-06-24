// in app/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { CATEGORIES, type Product } from '@/types';
import ProductGrid from '@/components/ProductGrid';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [soldProducts, setSoldProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  
  const supabase = createClient();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase.from('products').select('*');

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }
      
      const { data, error } = await query.eq('status', 'Available').order('created_at', { ascending: false });

      if (data) setProducts(data);
      setLoading(false);
    };

    const fetchSoldProducts = async () => {
      const { data } = await supabase.from('products').select('*').eq('status', 'Sold').limit(4).order('created_at', { ascending: false });
      if (data) setSoldProducts(data);
    };

    fetchProducts();
    fetchSoldProducts();
  }, [selectedCategory, supabase]);

  return (
    <main className="container mx-auto p-4 md:p-8">
      {/* Category Filter Bar */}
      <div className="flex justify-center gap-2 md:gap-4 mb-12 flex-wrap">
        <button onClick={() => setSelectedCategory('all')} className={`py-2 px-4 rounded-full font-bold transition-colors ${selectedCategory === 'all' ? 'bg-vibrant-magenta text-white' : 'bg-white/30'}`}>All</button>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)} className={`py-2 px-4 rounded-full font-bold transition-colors ${selectedCategory === cat ? 'bg-vibrant-magenta text-white' : 'bg-white/30'}`}>{cat}</button>
        ))}
      </div>
      
      <h2 className="text-2xl text-center mb-8">LATEST DROP</h2>
      {loading ? <p>Loading...</p> : <ProductGrid products={products} />}
      
      {soldProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl text-center mb-8 text-red-500">RECENTLY SOLD</h2>
          <ProductGrid products={soldProducts} />
        </div>
      )}
    </main>
  );
}