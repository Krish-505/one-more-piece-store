// in components/ProductGrid.tsx
import ProductCard from './ProductCard';
import type { Product } from '@/types';

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} disabled={product.status !== 'Available'} />
      ))}
    </div>
  );
}