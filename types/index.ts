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
export const CATEGORIES = [
  "Shirt",
  "T-Shirt",
  "Pant",
  "Accessories",
  "Other",
];