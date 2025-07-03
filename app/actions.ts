// in app/actions.ts
"use server";

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { type CartItem } from '@/lib/CartContext';

// --- PRODUCT MANAGEMENT ACTIONS ---

export async function deleteProduct(productId: number) {
  const supabase = await createSupabaseServerClient();
  
  const { data: product } = await supabase.from('products').select('image_url').eq('id', productId).single();
  if (product?.image_url && Array.isArray(product.image_url)) {
    const fileNames = product.image_url.map(url => url.split('/').pop()).filter(Boolean) as string[];
    if (fileNames.length > 0) {
      await supabase.storage.from('product-images').remove(fileNames);
    }
  }
  
  const { error } = await supabase.from('products').delete().match({ id: productId });
  if (error) {
    return { success: false, message: `DB delete failed: ${error.message}` };
  }
  
  revalidatePath('/dashboard');
  revalidatePath('/');
  return { success: true, message: "Product deleted successfully." };
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


// --- AUTHENTICATION ACTIONS ---

export async function signup(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    redirect('/signup?message=Could not authenticate user');
  }
  redirect('/signup?message=Check email to continue sign in process');
}

export async function login(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect('/login?message=Could not authenticate user');
  }
  redirect('/');
}

export async function logout() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/login');
}


// --- PROFILE & ORDER ACTIONS ---

export async function updateProfile(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, message: "You must be logged in." };

  const profileData = {
    full_name: formData.get('full_name') as string,
    phone: formData.get('phone') as string,
    address_line: formData.get('address_line') as string,
    district: formData.get('district') as string,
    pincode: formData.get('pincode') as string,
    alt_phone: formData.get('alt_phone') as string,
  };

  const { error } = await supabase.from('profiles').update(profileData).eq('id', user.id);
  if (error) return { success: false, message: `Error updating profile: ${error.message}` };

  revalidatePath('/profile');
  return { success: true, message: "Profile updated successfully!" };
}

export async function placeOrder(formData: FormData, cartItems: CartItem[], totalPrice: number) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const customerData = {
    customer_name: formData.get('customer_name') as string,
    customer_email: formData.get('customer_email') as string,
    customer_phone: formData.get('customer_phone') as string,
    address_line: formData.get('address_line') as string,
    district: formData.get('district') as string,
    pincode: formData.get('pincode') as string,
    alt_phone: formData.get('alt_phone') as string,
  };

  const productsForDb = cartItems.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        image_url: Array.isArray(item.product.image_url) ? item.product.image_url[0] : null
       
      }));

  const orderToInsert = {
    ...customerData,
    order_total: totalPrice,
    ordered_products: productsForDb,
    user_id: user ? user.id : null, // Save user_id if logged in, otherwise null
  };
  
   const { error } = await supabase
    .from('orders')
    .insert([{ 
      ...customerData,
      order_total: totalPrice,
      ordered_products: productsForDb, // This now contains image URLs
      user_id: user ? user.id : null 
    }]);
   if (error) {
    return { success: false, message: `Database error: ${error.message}` };
  }
   const productIdsToUpdate = cartItems.map(item => item.product.id);

  // Perform the update query on the 'products' table
  // Use the .in() filter to update all products whose ID is in our array
  const { error: productStatusError } = await supabase
    .from('products')
    .update({ status: 'Sold' })
    .in('id', productIdsToUpdate);

  if (productStatusError) {
    // In a real-world scenario, you might want to handle this failure (e.g., log it),
    // but for now, we'll just report it. The order was still placed.
    console.error("Failed to update product statuses, but order was placed:", productStatusError.message);
  }
  
  if (user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        full_name: customerData.customer_name,
        phone: customerData.customer_phone,
        address_line: customerData.address_line,
        district: customerData.district,
        pincode: customerData.pincode,
        alt_phone: customerData.alt_phone,
      })
      .eq('id', user.id);
      

    if (profileError) {
      console.error("Non-critical error: Could not update user profile:", profileError.message);
    }
  }
  revalidatePath('/');
  revalidatePath('/dashboard');
  // We should also revalidate the product detail pages for the sold items
  productIdsToUpdate.forEach(id => revalidatePath(`/product/${id}`));
  
  return { success: true, message: "Order placed and products updated." };
}


export async function updateUserProfile(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "User not authenticated." };
  }

  const profileData = {
    full_name: formData.get('full_name') as string,
    phone: formData.get('phone') as string,
    address_line: formData.get('address_line') as string,
    district: formData.get('district') as string,
    pincode: formData.get('pincode') as string,
    alt_phone: formData.get('alt_phone') as string,
  };

  const { error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', user.id);

  if (error) {
    return { success: false, message: `Error updating profile: ${error.message}` };
  }

  // Revalidate the profile page to show the new data
  revalidatePath('/profile');
  return { success: true, message: "Profile updated successfully!" };
}