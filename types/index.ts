// in types/index.ts
export type Product = {
  id: number;
  created_at: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  size: string | null;
  image_url: string[]| null;
  status: string; 
};
export type Profile = {
  id: string; // Corresponds to the user's auth ID (uuid)
  full_name: string | null;
  phone: string | null;
  address_line: string | null;
  district: string | null;
  pincode: string | null;
  alt_phone: string | null;
};
export const CATEGORIES = [
  "Shirts",
  "Tees",
  "Bottoms",
  "Jackets",
  "Accessories",
];
// in types/index.ts
export type Order = {
  id: number;
  created_at: string;
  customer_name: string;
  order_total: number;
  ordered_products: [{ id: number; name: string; price: number; quantity: number }];
  // ... add other order fields if needed
};