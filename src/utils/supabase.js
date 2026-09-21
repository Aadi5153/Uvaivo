import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://czblfgkkalfadmuzwcbp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_1th4CBVWI9qVvwBMyKG13w_RRhTVRe4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function uploadProductImage(file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `prod_${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, { cacheControl: '3600', upsert: false });

  if (error) {
    console.error('Upload error:', error);
    return null;
  }

  const { data: urlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}
