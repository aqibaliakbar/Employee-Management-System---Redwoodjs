// api/src/lib/db.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  process.env.SUPABASE_URL || 'https://vfzzvgkcpolgfkdqbtbn.supabase.co'
const supabaseKey =
  process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmenp2Z2tjcG9sZ2ZrZHFidGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3ODY4MzksImV4cCI6MjA0NjM2MjgzOX0.rcEkrXI7tfuDOiiUGCwS10d_f3Pq7YIGJVsRblxRUig'

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
})

// Test connection
const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('count')
      .single()

    if (error) throw error
    console.log('Supabase connected successfully')
  } catch (error) {
    console.error('Supabase connection error:', error)
  }
}

testConnection()
