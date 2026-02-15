import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 'export' likhna zaroori hai taaki doosri files ise use kar sakein
export const supabase = createClient(supabaseUrl, supabaseAnonKey)