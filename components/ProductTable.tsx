// in components/ProductTable.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// --- THIS IS THE FIX ---
// Import the server actions, NOT fetch
import { deleteProduct, updateProductStatus } from '@/app/actions';

type Product = { id: number; name: string; price: number; category: string; status: string; };

export default function ProductTable({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const router = useRouter();

  const handleDelete = async (productId: number) => {
    if (!window.confirm("Are you sure?")) return;
    
    // Call the SERVER ACTION
    const result = await deleteProduct(productId);
    
    if (result.success) {
      setProducts(products.filter(p => p.id !== productId));
      alert(result.message);
    } else {
      alert(`Error: ${result.message}`);
    }
  };

  const handleStatusChange = async (productId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'Available' ? 'Sold' : 'Available';
    const oldProducts = [...products];
    setProducts(products.map(p => p.id === productId ? { ...p, status: newStatus } : p));
    
    // Call the SERVER ACTION
    const result = await updateProductStatus(productId, newStatus);
    
    if (!result.success) {
      setProducts(oldProducts);
      alert(`Error: ${result.message}`);
    }
  };

  const handleEdit = (productId: number) => {
    router.push(`/dashboard/edit-product/${productId}`);
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