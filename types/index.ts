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
  id: string; // This is a uuid
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

export type OrderedProduct = {
  id: number;
  name: string;
  price: number;
  image_url: string | null; // This is a single string (the primary image)
};

export type Order = {
  id: number;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address_line: string;
  district: string;
  pincode: string;
  alt_phone: string | null;
  order_total: number;
  ordered_products: OrderedProduct[]; // This is an array of the type above
  user_id: string | null;
};
export type CartItem = {
  product: Product;
};