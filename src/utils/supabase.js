import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://czblfgkkalfadmuzwcbp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_1th4CBVWI9qVvwBMyKG13w_RRhTVRe4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
