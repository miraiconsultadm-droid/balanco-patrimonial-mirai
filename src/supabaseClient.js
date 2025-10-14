import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vwkzrcfewxekcowbhvzf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3a3pyY2Zld3hla2Nvd2JodnpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg2NzQ4MzIsImV4cCI6MjA0NDI1MDgzMn0.xLTqYhJPQGWcJ0c5N3eDGJqQGxJDZN-cZXKkQdVZzYs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

