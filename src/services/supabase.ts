import { createClient } from "@supabase/supabase-js"

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://pdybrwmvsxxdsthhabzt.supabase.co"

const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_jXYA518D4PFIGSfIn1_wHw_G9sP1vvB"

export const supabase = createClient(supabaseUrl, supabaseKey)
export default supabase

