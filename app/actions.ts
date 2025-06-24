// in app/actions.ts
"use server";

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/utils/supabase/server';

export async function deleteProduct(productId: number) {
 
   const supabase = await createSupabaseServerClient(); 
  
  const { data: product } = await supabase.from('products').select('image_url').eq('id', productId).single();
  if (product?.image_url && Array.isArray(product.image_url)) {
    const fileNames = product.image_url.map(url => url.split('/').pop()).filter(Boolean) as string[];
    if (fileNames.length > 0) await supabase.storage.from('product-images').remove(fileNames);
  }
  const { error } = await supabase.from('products').delete().match({ id: productId });
  if (error) return { success: false, message: error.message };
  revalidatePath('/');
  revalidatePath('/dashboard');
  return { success: true, message: "Product deleted." };
}

export async function updateProductStatus(productId: number, newStatus: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('products').update({ status: newStatus }).eq('id', productId);
  if (error) {
    return { success: false, message: `Status update failed: ${error.message}` };
  }

  revalidatePath('/dashboard');
  revalidatePath('/');
  return { success: true, message: "Status updated." };
}

export async function editProduct(productId: number, formData: FormData) {
  const supabase = await createSupabaseServerClient(); 

  const newImageFiles = formData.getAll('newImages') as File[];
  let updatedImageUrls: string[] | null = null;

  if (newImageFiles.length > 0 && newImageFiles[0].size > 0) {
    const { data: oldProduct } = await supabase.from('products').select('image_url').eq('id', productId).single();
    if (oldProduct?.image_url && Array.isArray(oldProduct.image_url)) {
      const oldNames = oldProduct.image_url.map(url => url.split('/').pop()).filter(Boolean) as string[];
      if (oldNames.length > 0) await supabase.storage.from('product-images').remove(oldNames);
    }

    updatedImageUrls = [];
    for (const file of newImageFiles) {
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, file);
      if (uploadError) return { success: false, message: `Image upload failed: ${uploadError.message}` };
      const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
      updatedImageUrls.push(urlData.publicUrl);
    }
  }

  const productDataToUpdate = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    price: Number(formData.get('price')),
    category: formData.get('category') as string,
    size: formData.get('size') as string,
    status: formData.get('status') as string,
  };
  
  if (updatedImageUrls !== null) {
    (productDataToUpdate as any).image_url = updatedImageUrls;
  }

  const { error: updateError } = await supabase.from('products').update(productDataToUpdate).eq('id', productId);
  if (updateError) return { success: false, message: `Database update failed: ${updateError.message}` };

  revalidatePath('/dashboard');
  revalidatePath('/');
  revalidatePath(`/product/${productId}`);
  return { success: true, message: "Product updated." };
}
import { type CartItem } from '@/lib/CartContext'; // Import the CartItem type

export async function placeOrder(formData: FormData, cartItems: CartItem[], totalPrice: number) {
  const supabase = await createSupabaseServerClient(); // Using our helper from before

  const customerData = {
    customer_name: formData.get('customer_name') as string,
    customer_email: formData.get('customer_email') as string,
    shipping_address: formData.get('shipping_address') as string,
    customer_phone: formData.get('customer_phone') as string,
  };

  // Create a simplified version of the cart items to store in the 'jsonb' column
  const productsForDb = cartItems.map(item => ({
    id: item.product.id,
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
  }));

  // Insert the new order into the 'orders' table
  const { error } = await supabase
    .from('orders')
    .insert([{ 
      ...customerData, 
      order_total: totalPrice,
      ordered_products: productsForDb
    }]);

  if (error) {
    // IMPORTANT: Because we haven't set RLS policies for 'orders' yet, this will fail.
    // That's our next step!
    return { success: false, message: `Database error: ${error.message}` };
  }

  // We don't need to revalidate paths for orders as they aren't public
  return { success: true };
}