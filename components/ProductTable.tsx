// in components/ProductTable.tsx
"use client"; // This must be a client component to handle user interactions

import { useState } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

// Define the shape of the product data we expect for this table
type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  status: string;
};

// The component accepts the initial list of products fetched from the server
export default function ProductTable({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async (productId: number) => {
    // Ask for confirmation before performing a destructive action
    if (!window.confirm("Are you sure you want to delete this product? This cannot be undone.")) {
      return;
    }

    // Call Supabase to delete the row matching the ID
    const { error } = await supabase
      .from('products')
      .delete()
      .match({ id: productId });

    if (error) {
      alert(`Error deleting product: ${error.message}`);
    } else {
      // If successful, update the local state to remove the product from the UI instantly
      setProducts(products.filter(p => p.id !== productId));
      alert("Product deleted successfully.");
    }
  };

  const handleEdit = (productId: number) => {
    // Navigate to the dynamic edit page for the specific product
    router.push(`/dashboard/edit-product/${productId}`);
  };

  const handleStatusChange = async (productId: number, currentStatus: string) => {
    // Toggle the status
    const newStatus = currentStatus === 'Available' ? 'Sold' : 'Available';

    // Optimistic UI Update: Change the status in the UI immediately
    setProducts(products.map(p => 
      p.id === productId ? { ...p, status: newStatus } : p
    ));

    // Send the update to the database in the background
    const { error } = await supabase
      .from('products')
      .update({ status: newStatus })
      .eq('id', productId);

    if (error) {
      // If the database update fails, alert the user and revert the UI change
      alert(`Error updating status: ${error.message}`);
      setProducts(products.map(p => 
        p.id === productId ? { ...p, status: currentStatus } : p // Revert to the old status
      ));
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white/20 rounded-lg shadow-md">
        <thead className="bg-dark-charcoal text-white">
          <tr>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Name</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Price</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Category</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Status</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
          </tr>
        </thead>
        <tbody className="text-dark-charcoal">
          {products.map((product) => (
            <tr key={product.id} className="border-b border-gray-400 hover:bg-white/30">
              <td className="py-3 px-4">{product.name}</td>
              <td className="py-3 px-4">₹{product.price}</td>
              <td className="py-3 px-4">{product.category}</td>
              <td className="py-3 px-4">
                <span className={`py-1 px-3 rounded-full text-xs text-white ${product.status === 'Available' ? 'bg-green-500' : 'bg-red-500'}`}>
                  {product.status}
                </span>
              </td>
              <td className="py-3 px-4 flex flex-wrap gap-2">
                <button
                  onClick={() => handleStatusChange(product.id, product.status)}
                  className={`font-bold py-1 px-2 rounded text-xs text-white ${product.status === 'Available' ? 'bg-yellow-500 hover:bg-yellow-700' : 'bg-green-500 hover:bg-green-700'}`}
                >
                  {product.status === 'Available' ? 'Mark Sold' : 'Mark Available'}
                </button>
                <button 
                  onClick={() => handleEdit(product.id)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs">
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}