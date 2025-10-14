import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vwkzrcfewxekcowbhvzf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3a3pyY2Zld3hla2Nvd2JodnpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTIxNjMsImV4cCI6MjA3NTc4ODE2M30.gnAGQo2oLjLY2kOiqA16vOPUK-3SjgAmzqlT5wDrnaw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

