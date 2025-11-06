import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://tmrnspktjewfkhbqitnw.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtcm5zcGt0amV3ZmtoYnFpdG53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNzM0ODYsImV4cCI6MjA2OTg0OTQ4Nn0._VoKxBW-Bz1GdxUAGVhApDQwR55idrA8DyxeP9cOoXQ'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

